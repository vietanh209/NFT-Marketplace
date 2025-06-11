import nftMarketplace from './NFTMarketplace.json';
import transferFunds from './TransferFunds.json';
import nftAuction from './NFTAuction.json';
import nft from './NFT.json';

export const NFTAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3"
export const NFTABI = nft.abi
export const NFTMarketplaceAddress = process.env.NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS || "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
export const NFTMarketplaceABI = nftMarketplace.abi

export const NFTAuctionAddress = process.env.NEXT_PUBLIC_NFT_AUCTION_ADDRESS || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
export const NFTAuctionABI = nftAuction.abi

export const TransferFundsAddress = process.env.NEXT_PUBLIC_TRANSFER_FUNDS_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
export const TransferFundsABI = transferFunds.abi