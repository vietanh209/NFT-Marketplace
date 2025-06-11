// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./NFTMarketplace.sol";
import "./TransferFunds.sol";

contract NFTAuction is ReentrancyGuard {
    using SafeMath for uint256;

    struct Offer {
        address payable bidder;
        uint256 price;
        uint256 timestamp;
        bool active;
    }

    mapping(uint256 => Offer[]) public tokenIdToOffers;
    NFTMarketplace private nftMarketplaceContract;
    TransferFunds private transferFundsContract;
    
    event OfferMade(
        uint256 indexed tokenId,
        address bidder,
        uint256 price,
        uint256 timestamp
    );
    event OfferCanceled(uint256 indexed tokenId, address bidder);
    event OfferAccepted(uint256 indexed tokenId, address bidder, uint256 price);
    event OffersExpired(uint256 indexed tokenId, uint256 count);

    constructor(address transferFundsAddress) {
        transferFundsContract = TransferFunds(payable(transferFundsAddress));
    }
    
    function makeOffer(
        uint256 tokenId,
        uint256 price,
        uint256 timestamp
    ) external payable nonReentrant {
        require(msg.value == price, "Ether sent must equal the offer price");
        _cancelExpiredOffers(tokenId);
        Offer memory newOffer = Offer({
            bidder: payable(msg.sender),
            price: price,
            timestamp: timestamp,
            active: true
        });

        tokenIdToOffers[tokenId].push(newOffer);
        
        // Record transaction in TransferFunds
        transferFundsContract.addDataToBlockChain(
            payable(address(this)),
            price,
            string(abi.encodePacked("Offer made for NFT #", _uintToString(tokenId)))
        );

        emit OfferMade(tokenId, msg.sender, price, timestamp);
    }

    function unmakeOffer(uint256 tokenId) external nonReentrant {
        Offer[] storage offers = tokenIdToOffers[tokenId];
        bool found = false;
        uint256 refundAmount = 0;

        for (uint256 i = 0; i < offers.length; i++) {
            Offer storage offer = offers[i];
            if (offer.bidder == msg.sender && offer.active) {
                offer.active = false;
                refundAmount = offer.price;
                
                // Record refund transaction in TransferFunds
                transferFundsContract.addDataToBlockChain(
                    offer.bidder,
                    refundAmount,
                    string(abi.encodePacked("Offer cancelled for NFT #", _uintToString(tokenId)))
                );
                
                offer.bidder.transfer(refundAmount);
                emit OfferCanceled(tokenId, msg.sender);
                found = true;
                break;
            }
        }

        require(found, "No active offer found for caller");
    }

    function acceptOffer(uint256 tokenId) external nonReentrant {
        Offer[] storage offers = tokenIdToOffers[tokenId];
        require(offers.length > 0, "No offers available");
        _cancelExpiredOffers(tokenId);
        
        // Find highest offer
        uint256 highestOfferIndex = 0;
        uint256 highestPrice = 0;
        for (uint256 i = 0; i < offers.length; i++) {
            if (offers[i].active && offers[i].price > highestPrice) {
                highestPrice = offers[i].price;
                highestOfferIndex = i;
            }
        }
        
        Offer storage highestOffer = offers[highestOfferIndex];
        require(highestOffer.active, "Highest offer is not active");
        require(
            highestOffer.bidder != address(0),
            "Highest offer bidder is zero address"
        );

        highestOffer.active = false;
        
        // Refund other offers
        for (uint256 i = 0; i < offers.length; i++) {
            if (i != highestOfferIndex && offers[i].active) {
                offers[i].active = false;
                
                // Record refund transaction in TransferFunds
                transferFundsContract.addDataToBlockChain(
                    offers[i].bidder,
                    offers[i].price,
                    string(abi.encodePacked("Offer refunded for NFT #", _uintToString(tokenId)))
                );
                
                offers[i].bidder.transfer(offers[i].price);
            }
        }

        emit OfferAccepted(tokenId, highestOffer.bidder, highestOffer.price);
    }

    function handleFundTransfer(
        address payable seller,
        uint256 highestPrice
    ) external nonReentrant {
        // Record payment transaction in TransferFunds
        transferFundsContract.addDataToBlockChain(
            seller,
            highestPrice,
            string(abi.encodePacked("Payment for NFT sale"))
        );
        
        // Transfer funds to the seller
        (bool success, ) = seller.call{value: highestPrice}("");
        require(success, "Transfer to seller failed");
    }

    function getHighestBidder(
        uint256 tokenId
    ) external view returns (address, uint256) {
        Offer[] storage offers = tokenIdToOffers[tokenId];
        uint256 highestPrice = 0;
        address highestBidder = address(0);
        for (uint256 i = 0; i < offers.length; i++) {
            if (offers[i].active && offers[i].price > highestPrice) {
                highestPrice = offers[i].price;
                highestBidder = offers[i].bidder;
            }
        }

        return (highestBidder, highestPrice);
    }

    function getOffers(uint256 tokenId) public view returns (Offer[] memory) {
        return tokenIdToOffers[tokenId];
    }

    function cancelAllOffers(uint256 tokenId) external nonReentrant {
        Offer[] storage offers = tokenIdToOffers[tokenId];
        uint256 refundsCount = 0;
        
        for (uint256 i = 0; i < offers.length; i++) {
            if (offers[i].active) {
                offers[i].active = false;
                
                // Record refund transaction in TransferFunds
                transferFundsContract.addDataToBlockChain(
                    offers[i].bidder,
                    offers[i].price,
                    string(abi.encodePacked("Offer refunded due to cancellation for NFT #", _uintToString(tokenId)))
                );
                
                offers[i].bidder.transfer(offers[i].price);
                refundsCount++;
            }
        }
        
        emit OffersExpired(tokenId, refundsCount);
    }

    function _cancelExpiredOffers(uint256 tokenId) internal {
        Offer[] storage offers = tokenIdToOffers[tokenId];
        uint256 currentTime = block.timestamp;
        uint256 refundsCount = 0;
        
        for (uint256 i = 0; i < offers.length; i++) {
            // Check if offer has expired (current time > 1.5 * timestamp)
            if (offers[i].active && currentTime > offers[i].timestamp.add(offers[i].timestamp.div(2))) {
                offers[i].active = false;
                
                // Record refund transaction in TransferFunds
                transferFundsContract.addDataToBlockChain(
                    offers[i].bidder,
                    offers[i].price,
                    string(abi.encodePacked("Offer refunded due to expiry for NFT #", _uintToString(tokenId)))
                );
                
                payable(offers[i].bidder).transfer(offers[i].price);
                refundsCount++;
            }
        }
        
        if (refundsCount > 0) {
            emit OffersExpired(tokenId, refundsCount);
        }
    }
    
    // Utility function to convert uint to string
    function _uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        
        uint256 temp = value;
        uint256 digits;
        
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }
    
    // Allow contract to receive ETH directly
    receive() external payable {
        // Record direct ETH transfer in TransferFunds
        transferFundsContract.addDataToBlockChain(
            payable(address(this)),
            msg.value,
            "Direct ETH transfer to auction contract"
        );
    }
    
    // Fallback function in case of incorrect function calls
    fallback() external payable {
        // Record fallback ETH transfer in TransferFunds
        transferFundsContract.addDataToBlockChain(
            payable(address(this)),
            msg.value,
            "Fallback: Direct ETH transfer to auction contract"
        );
    }
}
