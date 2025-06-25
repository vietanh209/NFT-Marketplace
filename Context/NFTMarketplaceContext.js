import React, { useEffect, useState, useCallback } from "react";

import Web3Modal from "web3modal";
import { ethers } from "ethers";

import { useRouter } from "next/router";
import axios from "axios";
const dotenv = require("dotenv");
dotenv.config();
const api_key = process.env.NEXT_PUBLIC_API_PINATA;
const api_secret = process.env.NEXT_PUBLIC_API_SECRET_PINATA;
const pinata_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
const gatewayKey = process.env.NEXT_PUBLIC_GATEWAY_KEY;
const url = process.env.NEXT_PUBLIC_PINATA_URL;
//INTERNAL IMPORT
import {
  NFTMarketplaceAddress,
  NFTMarketplaceABI,
  TransferFundsAddress,
  TransferFundsABI,
  NFTAuctionABI,
  NFTAuctionAddress,
  NFTABI,
  NFTAddress
} from "./Constants";

//Fetching smart contract
const fetchContract = (address, abi, signerOrProvider) =>
  new ethers.Contract(address, abi, signerOrProvider);

// ---Connecting width smart contract

const connectingWithSmartContract = async (contractType) => {
  try {
    const web3ModalInstance = new Web3Modal();
    const connection = await web3ModalInstance.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract;
    switch (contractType) {
      case 'nft':
        contract = fetchContract(NFTAddress, NFTABI, signer);
        break;
      case 'marketplace':
        contract = fetchContract(NFTMarketplaceAddress, NFTMarketplaceABI, signer);
        break;
      case 'transferFunds':
        contract = fetchContract(TransferFundsAddress, TransferFundsABI, signer);
        break;
      case 'auction':
        contract = fetchContract(NFTAuctionAddress, NFTAuctionABI, signer);
        break;
      default:
        throw new Error('Unknown contract type');
    }
    return contract;
  } catch (error) {
    console.log('Something went wrong while connecting with smart contract:', error);
    throw error; // Rethrow the error to handle it upstream if needed
  }
};

const fetchTransferFundsContract = (signerOrProvider) =>
  new ethers.Contract(TransferFundsAddress, TransferFundsABI, signerOrProvider);
// transferfunds
const connectToTransferFunds = async () => {
  try {
    const web3ModalInstance = new Web3Modal();
    const connection = await web3ModalInstance.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchTransferFundsContract(signer); // Assuming fetchContract is defined elsewhere
    return contract;
  } catch (error) {
    console.log(
      "Something went wrong while connecting with smart contract:",
      error
    );
  }
};

export const NFTMarketplaceContext = React.createContext();
export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "Discover, collect, and sell NFTS ";
  // --USESTAT
  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [allOffers, setAllOffers] = useState([]);
  const [walletName, setWalletName] = useState("");
  // TRANSFER FUNDs
  const [transactionCount, setTransactionCount] = useState("");
  const [transaction, setTransaction] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Token holdings state
  const [tokenHoldings, setTokenHoldings] = useState({});
  // Private name tags state
  const [privateTags, setPrivateTags] = useState({});
  
  const checkIfWalletConnected = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const getBalance = await provider.getBalance(accounts[0]);
      const bal = ethers.utils.formatEther(getBalance);
      // console.log("api key", api_key ,api_serect, pinata_JWT);
      setAccountBalance(bal);
      const ensName = await provider.lookupAddress(accounts[0]);
      setWalletName(ensName || "No ENS name found");
    } catch (error) {
      console.log("check if wallet connect error", error);
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
    console.log ("walletName"+walletName)
  }, []);
  // connect wallet function
  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("connectWallet error", error);
    }
  };

  // Add ethereum account change listener
  useEffect(() => {
    if (window.ethereum) {
      // Event listener for account changes
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          
          // Update account balance
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const getBalance = await provider.getBalance(accounts[0]);
          const bal = ethers.utils.formatEther(getBalance);
          setAccountBalance(bal);
          
          // Refetch data for the new account
          fetchNFTS();
          fetchMyNFTsOrListedNFTs();
        } else {
          setCurrentAccount("");
          setAccountBalance("");
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Clean up event listener
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  // upload to ipfs function
  
  const uploadFileToIPFS = async (file) => {
    try {
      console.log("File being uploaded:", file?.name, "Size:", file?.size);
      if (!file) {
        throw new Error("File is undefined");
      }
      
      const formData = new FormData();
      formData.append("file", file);
      
      // Log để kiểm tra FormData
      console.log("FormData created with file:", file.name);
      
      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: api_key,
          pinata_secret_api_key: api_secret,
          Authorization: `Bearer ${pinata_JWT}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("Pinata response:", resFile.data);
      const imgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
      return imgHash;
    } catch (error) {
      console.error("Error while uploading to IPFS:", error);
      if (error.response) {
        // Pinata API trả về error response
        console.error("Pinata API error:", error.response.data);
      }
      throw error;
    }
  };

  const uploadJSONToPinata = async (data) => {
    try {
      const resFile = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: JSON.stringify(data),
        headers: {
          pinata_api_key: api_key,
          pinata_secret_api_key: api_secret,
          Authorization: `Bearer ${pinata_JWT}`,
        },
      });

      const ipfsHash = resFile.data.IpfsHash;
      const imgHash = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      return imgHash;
    } catch (error) {
      console.error("Error while uploading to Pinata:", error);
      throw new Error("Failed to upload to Pinata");
    }
  };

  const unpinFromPinata = async (ipfsHash) => {
    try {
      const response = await axios.delete(`https://api.pinata.cloud/pinning/unpin/${ipfsHash}`, {
        headers: {
          pinata_api_key: api_key,
          pinata_secret_api_key: api_secret,
          Authorization: `Bearer ${pinata_JWT}`,
        },
      });
      if (response.status === 200) {
        console.log(`Successfully unpinned ${ipfsHash}`);
      } else {
        throw new Error(`Failed to unpin from Pinata. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error while unpinning from Pinata:", error);
      throw new Error("Failed to unpin from Pinata");
    }
  };

  // Function to get gas price from Ethereum network
  const getGasPrice = async () => {
    try {
      // Kiểm tra nếu ethereum object tồn tại
      if (typeof ethereum !== 'undefined') {
        const gasPrice = await ethereum.request({
          method: 'eth_gasPrice',
        });
        console.log("Gas price from network:", gasPrice);
        return ethers.utils.hexlify(gasPrice); // Convert gas price to hex format
      } else {
        // Fallback gas price nếu không có ethereum object
        console.log("Ethereum object not available, using fallback gas price");
        return ethers.utils.hexlify(ethers.utils.parseUnits("50", "gwei").toHexString());
      }
    } catch (error) {
      console.error("Error fetching gas price:", error);
      // Trả về giá trị mặc định an toàn
      console.log("Using safe default gas price due to error");
      return ethers.utils.hexlify(ethers.utils.parseUnits("50", "gwei").toHexString());
    }
  };
  // createNFT function
  const createNFT = async (
    name,
    price,
    imageurl,
    description,
    category,
    timeActions,
    router
  ) => {
    if (!category || !name || !description || !price || !imageurl) {
      console.log("Data Is Missing");
      setError("Data Is Missing");
      setOpenError(true);
      return;
    }

    const data = { name, description, imageurl, category, timeActions };
    console.log("Data to upload:", data, timeActions);

    try {
      const imgHash = await uploadJSONToPinata(data);
      console.log("img hash create", imgHash);
      // Tạo sale cho token mới
      await createSale(imgHash, price, timeActions);
      router.push("/NFTPage");
    } catch (error) {
      setError("Error while creating NFT");
      setOpenError(true);
    }
  };

  // createSale function
  const createSale = async (url, formInputPrice, timeActions, isReselling, id) => {
    try {
      // Đảm bảo price là chuỗi trước khi chuyển đổi
      const priceString = formInputPrice.toString();
      console.log("Price before parsing:", priceString);
      
      const price = ethers.utils.parseUnits(priceString, "ether");
      console.log("Price after parsing:", price.toString());
      
      const contract = await connectingWithSmartContract('marketplace');
      const listingPrice = await contract.getListingPrice();
      console.log("Listing price:", listingPrice.toString());
      
      // Sử dụng await để lấy gas price
      const maxFeePerGas = await getGasPrice();
      console.log("Max fee per gas:", maxFeePerGas);
      
      let transaction;
      if (isReselling) {
        console.log("Creating resell transaction for token ID:", id);
        transaction = await contract.resellToken(id, price, timeActions, {
          value: listingPrice.toString(),
          gasPrice: maxFeePerGas,
        });
      } else {
        console.log("Creating new token with URL:", url);
        transaction = await contract.createToken(url, price, timeActions, {
          value: listingPrice.toString(),
          gasPrice: maxFeePerGas,
        });
      }
      
      console.log("Transaction hash:", transaction.hash);
      await transaction.wait();
      console.log("Transaction confirmed");
    } catch (error) {
      console.error("Error while creating sale:", error);
      
      // Xử lý lỗi chi tiết hơn
      if (error.reason) {
        console.error("Error reason:", error.reason);
        setError("Error while creating sale: " + error.reason);
      } else if (error.code) {
        console.error("Error code:", error.code);
        setError("Error while creating sale: " + error.message);
      } else if (error.data && error.data.message) {
        setError("Error while creating sale: " + error.data.message);
      } else {
        setError("Error while creating sale: " + error.message);
      }
      
      setOpenError(true);
    }
  };

  const transferNFT = async (nft, address) => {
    try {
      const contract = await connectingWithSmartContract('marketplace');
      const maxFeePerGas = await getGasPrice()
      const transaction = await contract.transferNFT(nft.tokenId, address, {
        gasPrice: maxFeePerGas
      });
      await transaction.wait();
      router.push("/author");
    } catch (error) {
      console.log("error while your transfer", error);
    }
  }

  // --FETCH nft functinon
  // const fetchNFTS = async () => {
  //   try {
  //     const contract = await connectingWithSmartContract();
  //     const data = await contract.fetchMarketItem(); // Correct method name
  //     const items = await Promise.all(
  //       data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
  //         const tokenURI = await contract.tokenURI(tokenId);
  //         try {
  //           const response = await fetch(tokenURI);
  //           const jsonData = await response.json(); // Sửa đổi để lấy JSON trực tiếp

  //           const name = jsonData.name || "Name not available";
  //           const description = jsonData.description || "Description not available";
  //           const imageurl = jsonData.imageurl || "Image URL not available";
  //           const category = jsonData.category || "Category not available";

  //           const price = ethers.utils.formatUnits(unformattedPrice.toString(), "ether");

  //           return {
  //             price,
  //             tokenId: tokenId.toNumber(),
  //             seller,
  //             owner,
  //             name,
  //             description,
  //             category,
  //             imageurl,
  //             tokenURI,
  //           };
  //         } catch (error) {
  //           console.error("Error fetching tokenURI data:", error);
  //           setError("Error fetching tokenURI data:");
  //           setOpenError(true);
  //         }
  //       })
  //     );
  //     return items;
  //   } catch (error) {
  //     console.error("Error fetching market items:", error);
  //     setError("Error fetching data");
  //     setOpenError(true);
  //   }
  // };
  // --FETCH nft functino
  const fetchNFTS = async () => {
    try {
      const contract = await connectingWithSmartContract('marketplace');
      const data = await contract.fetchMarketItem(); // Assuming this method fetches market items correctly

      // Use Promise.all to concurrently fetch and process each NFT item
      console.log("data....", data)
      const items = await Promise.all(
        data.map(async ({ tokenId, seller, owner, timestamp, price: unfomattedPrice, }) => {
          try {
            const tokenURI = await contract.tokenURI(tokenId); // Fetch tokenURI for each tokenId
            const response = await fetch(tokenURI); // Fetch JSON data from tokenURI

            if (!response.ok) {
              throw new Error(`Failed to fetch tokenURI data for tokenId: ${tokenId}`);
            }

            const jsonData = await response.json();
            const jsonDataString = Object.keys(jsonData)[0]; // Assuming jsonData is an object
            const parsedData = JSON.parse(jsonDataString); // Parse JSON data

            // Extract properties or provide defaults if not present
            const name = parsedData.name || "Name not available";
            const description = parsedData.description || "Description not available";
            const imageurl = parsedData.imageurl || "Image URL not available";
            const category = parsedData.category || "Category not available";
            const formattedPrice = ethers.utils.formatUnits(unfomattedPrice.toString(), "ether");
            return {
              price: formattedPrice,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              name,
              description,
              category,
              imageurl,
              tokenURI,
              timestamp: new Date(timestamp.toNumber() * 1000).toISOString(),
            };
          } catch (error) {
            console.error(`Error fetching data for tokenId ${tokenId}:`, error);
            return null; // Return null or handle error gracefully
          }
        })
      );
      const validItems = items.filter(item => item !== null);
      return validItems;
    } catch (error) {
      console.error("Error fetching NFT data:", error);;
      return [];
    }
  };
  useEffect(() => {
    fetchNFTS();
  }, []);

  // FETCHING MY NFT OR LISTED NFTS

  // const fetchMyNFTsOrListedNFTs = async (type) => {
  //   try {
  //     const contract = await connectingWithSmartContract();
  //     let data;
  //     if (type === "fetchItemsListed") {
  //       data = await contract.fetchItemsListed();
  //     } else {
  //       data = await contract.fetchMyNFTs();
  //     }

  //     const items = await Promise.all(
  //       data.map(async ({ tokenId, seller, owner, price: unfomattedPrice }) => {
  //         const tokenURI = await contract.tokenURI(tokenId);
  //         try {
  //           const response = await fetch(tokenURI);
  //           if (!response.ok) {
  //             throw new Error("Failed to fetch tokenURI data");
  //           }
  //           const jsonData = await response.json();

  //           // Extract name, description, and imageurl from the parsed JSON object
  //           const category = jsonData.category || "Category not available";
  //           const name = jsonData.name || "Name not available";
  //           const description = jsonData.description || "Description not available";
  //           const imageurl = jsonData.imageurl || "Image URL not available";

  //           const price = ethers.utils.formatUnits(unfomattedPrice.toString(), "ether");

  //           return {
  //             price,
  //             tokenId: tokenId.toNumber(),
  //             seller,
  //             owner,
  //             imageurl,
  //             category,
  //             name,
  //             description,
  //             tokenURI,
  //           };
  //         } catch (error) {
  //           console.error("Error fetching tokenURI data:", error);
  //           throw error;
  //         }
  //       })
  //     );
  //     return items;
  //   } catch (error) {
  //     console.error("Error fetching NFT data:", error);
  //     return [];
  //   }
  // };
  const fetchMyNFTsOrListedNFTs = async (type) => {
    try {
      const contract = await connectingWithSmartContract('marketplace');
      let data;
      if (type == "fetchItemsListed") {
        data = await contract.fetchItemsListed();
      } else data = await contract.fetchMyNFTs();
      // contract.fetchMyNFTs()
      const items = await Promise.all(
        data.map(async ({ tokenId, seller, owner, price: unfomattedPrice }) => {
          const tokenURI = await contract.tokenURI(tokenId);
          try {
            const response = await fetch(tokenURI);
            // console.log("respon", response);
            const data = await response.json();
            // console.log("data",data)
            const jsonDataString = Object.keys(data)[0];
            const jsonData = JSON.parse(jsonDataString);
            // Extract name, description, and imageurl from the parsed JSON object
            const category = jsonData.hasOwnProperty("category")
              ? jsonData.category
              : "Category not available";
            const name = jsonData.hasOwnProperty("name")
              ? jsonData.name
              : "Name not available";
            const description = jsonData.hasOwnProperty("description")
              ? jsonData.description
              : "Description not available";
            const imageurl = jsonData.hasOwnProperty("imageurl")
              ? jsonData.imageurl
              : "Image URL not available";
            console.log("name", name);
            const price = ethers.utils.formatUnits(
              unfomattedPrice.toString(),
              "ether"
            );
            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              imageurl,
              category,
              name,
              description,
              tokenURI,
            };
          } catch (error) {
            console.error("Error fetching tokenURI data:", error);
            throw error;
          }
        })
      );
      return items;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyNFTsOrListedNFTs();
  }, []);
  // BUY NFTs FUNCTION
  const buyNFT = async (nft) => {
    try {
      const contract = await connectingWithSmartContract('marketplace');
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      const maxFeePerGas = await getGasPrice(); // tránh lỗi ga
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
        gasPrice: maxFeePerGas
      });
      await transaction.wait();
      router.push("/author");
    } catch (error) {
      setError("Error while buying NFT");
      throw error;
    }
  };
  // Make offer function
  const makeOffer = async (nft, price, desiredTimestamp) => {
    try {
      const contract = await connectingWithSmartContract('auction');
      const formattedPrice = ethers.utils.parseUnits(price.toString(), "ether");
      // Chuyển desiredTimestamp thành Unix timestamp
      const unixTimestamp = Math.floor(
        new Date(desiredTimestamp).getTime() / 1000
      );
      // Gọi hàm makeOffer từ smart contract và truyền value vào transaction
      console.log("Making offer for tokenId:", nft.tokenId);
      console.log("Offer price:", price);
      console.log("Offer expiry timestamp:", unixTimestamp);
      
      const maxFeePerGas = await getGasPrice()// tránh lỗi gas
      const transaction = await contract.makeOffer(
        nft.tokenId,
        formattedPrice,
        unixTimestamp,
        {
          value: formattedPrice,
          gasPrice: maxFeePerGas,
        }
      );
      
      setLoading(true);
      await transaction.wait();
      setLoading(false);
      
      console.log("Offer made successfully");
      
      // Call getAllTransactions to update the transaction list
      await getAllTransactions();
    } catch (error) {
      setError("Error making offer");
      console.error("Error making offer:", error);
      throw error;
    }
  };

  // unMake offer function
  const unMakeOffer = async (nft) => {
    try {
      const contract = await connectingWithSmartContract('auction');
      const maxFeePerGas = await getGasPrice()// tránh lỗi gas
      
      setLoading(true);
      const transaction = await contract.unmakeOffer(nft.tokenId, {
        gasPrice: maxFeePerGas
      });
      await transaction.wait();
      setLoading(false);
      
      // Update transaction list
      await getAllTransactions();
      
      console.log("Offer cancelled successfully");
    } catch (error) {
      setError("Error cancelling offer");
      console.error("Error canceling offer:", error);
      throw error;
    }
  };
  
  const acceptOffer = async (tokenId) => {
    try {
      const contract = await connectingWithSmartContract('marketplace');
      const maxFeePerGas = await getGasPrice()
      
      console.log("Accepting offer for tokenId:", tokenId);
      
      setLoading(true);
      const transaction = await contract.acceptOffer(tokenId, {
        gasPrice: maxFeePerGas
      });
      await transaction.wait();
      setLoading(false);
      
      // Update transaction list
      await getAllTransactions();
      
      console.log("Offer accepted successfully");
      router.push("/author");
    } catch (error) {
      setError("Error accepting offer");
      console.error("Error accepting offer:", error);
      throw error;
    }
  };
  // Fetch all offers
  const fetchOffers = useCallback(async (tokenId) => {
    try {
      const contract = await connectingWithSmartContract('auction');
      const offers = await contract.getOffers(tokenId);
      const formattedOffers = offers.map((offer) => ({
        bidder: offer.bidder,
        price: ethers.utils.formatUnits(offer.price.toString(), "ether"),
        active: offer.active,
        timestamp: new Date(offer.timestamp * 1000).toISOString(),
      }));
      setAllOffers(formattedOffers);
      console.log("list offer", formattedOffers);
      return formattedOffers;
    } catch (error) {
      console.error("Error fetching offers:", error);
      return [];
    }
  }, []);
  // cancelMarketItem
  const cancelMarketItem = async (nft) => {
    try {
      const contract = await connectingWithSmartContract('marketplace');
      const maxFeePerGas = await getGasPrice()// tránh lỗi gas
      const transaction = await contract.cancelMarketItem(nft.tokenId, {
        gasPrice: maxFeePerGas
      });
      await transaction.wait();
      router.push("/author");
    } catch (error) {
      setError("Error while unlisting token");
      console.log("Error while unlisting token", error);
      throw error;
    }
  };
  // TRANSFER FUNDs
  const transferEther = async (address, ether, message) => {
    try {
      if (currentAccount) {
        const contract = await connectToTransferFunds();
        const unfomattedPrice = ethers.utils.parseEther(ether);
        
        // Add validation for large transfers
        if (parseFloat(ether) > 100) {
          setError("Cannot transfer more than 100 ETH at once for security reasons");
          setOpenError(true);
          return;
        }
        
        // Get gas price and calculate gas limit
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const gasPrice = await provider.getGasPrice();
        // Calculate gas - use a standard gas limit for transfers
        const gasLimit = 21000;
        
        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: address,
              gas: ethers.utils.hexlify(gasLimit),
              gasPrice: gasPrice.toHexString(),
              value: unfomattedPrice._hex,
            },
          ],
        });
        setLoading(true);
        const transaction = await contract.addDataToBlockChain(
          address,
          unfomattedPrice,
          message
        );
        
        // Wait for the transaction to be mined
        await transaction.wait();
        
        // Update transaction count
        const transactionCount = await contract.getTransactionCount();
        setTransactionCount(transactionCount.toNumber());
        
        // Update account balance
        const getBalance = await provider.getBalance(currentAccount);
        const bal = ethers.utils.formatEther(getBalance);
        setAccountBalance(bal);
        
        // Get updated transactions
        await getAllTransactions();
        
        setLoading(false);
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log("Error in transfer", error);
    }
  };

  // fetch all transaction
  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const contract = await connectToTransferFunds();
        
        // Get all transactions from the contract
        const availableTransaction = await contract.getAllTransaction();
        
        // Format the transaction data
        const readTransaction = availableTransaction.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(
            transaction.timestamps.toNumber() * 1000
          ).toLocaleDateString(),
          message: transaction.message,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
        }));
        
        console.log("Transactions loaded:", readTransaction.length);
        setTransaction(readTransaction);
        
        // Update transaction count
        const transactionCount = await contract.getTransactionCount();
        setTransactionCount(transactionCount.toNumber());
      } else {
        console.log("Ethereum object not found");
      }
    } catch (error) {
      console.log("Error in getAllTransactions:", error);
    }
  };

  // Add disconnect wallet function
  const disconnectWallet = async () => {
    try {
      setCurrentAccount("");
      setAccountBalance("");
      
      // For MetaMask, we need to communicate the disconnect intent
      // since MetaMask doesn't have a direct disconnect method
      if (window.ethereum && window.ethereum.isMetaMask) {
        // Clear any cached approvals - this helps with some wallets
        if (window.ethereum._state && window.ethereum._state.accounts) {
          window.ethereum._state.accounts = [];
        }
        
        // Let the user know they need to manually disconnect in MetaMask
        console.log("Please disconnect your wallet manually in MetaMask");
        setError("Please disconnect your wallet manually in MetaMask extension");
        setOpenError(true);
      }
    } catch (error) {
      console.log("disconnectWallet error", error);
    }
  };

  useEffect(() => {
    // Load private tags from local storage
    const loadPrivateTags = () => {
      try {
        const savedTags = localStorage.getItem(`privateTags_${currentAccount}`);
        if (savedTags) {
          setPrivateTags(JSON.parse(savedTags));
        }
      } catch (error) {
        console.log("Error loading private tags:", error);
      }
    };
    
    // Load token holdings from local storage
    const loadTokenHoldings = () => {
      try {
        const savedHoldings = localStorage.getItem(`tokenHoldings_${currentAccount}`);
        if (savedHoldings) {
          setTokenHoldings(JSON.parse(savedHoldings));
        }
      } catch (error) {
        console.log("Error loading token holdings:", error);
      }
    };
    
    if (currentAccount) {
      loadPrivateTags();
      loadTokenHoldings();
    }
  }, [currentAccount]);
  
  // Add or update a private name tag
  const addPrivateTag = (address, name) => {
    try {
      const updatedTags = { ...privateTags, [address]: name };
      setPrivateTags(updatedTags);
      localStorage.setItem(`privateTags_${currentAccount}`, JSON.stringify(updatedTags));
      return true;
    } catch (error) {
      console.log("Error adding private tag:", error);
      return false;
    }
  };
  
  // Remove a private name tag
  const removePrivateTag = (address) => {
    try {
      const updatedTags = { ...privateTags };
      delete updatedTags[address];
      setPrivateTags(updatedTags);
      localStorage.setItem(`privateTags_${currentAccount}`, JSON.stringify(updatedTags));
      return true;
    } catch (error) {
      console.log("Error removing private tag:", error);
      return false;
    }
  };
  
  // Add or update token holdings
  const updateTokenHolding = (tokenSymbol, amount, price = 0) => {
    try {
      const updatedHoldings = { 
        ...tokenHoldings, 
        [tokenSymbol]: { 
          amount: amount,
          price: price,
          value: amount * price,
          lastUpdated: new Date().toISOString()
        } 
      };
      setTokenHoldings(updatedHoldings);
      localStorage.setItem(`tokenHoldings_${currentAccount}`, JSON.stringify(updatedHoldings));
      return true;
    } catch (error) {
      console.log("Error updating token holding:", error);
      return false;
    }
  };
  
  // Remove a token holding
  const removeTokenHolding = (tokenSymbol) => {
    try {
      const updatedHoldings = { ...tokenHoldings };
      delete updatedHoldings[tokenSymbol];
      setTokenHoldings(updatedHoldings);
      localStorage.setItem(`tokenHoldings_${currentAccount}`, JSON.stringify(updatedHoldings));
      return true;
    } catch (error) {
      console.log("Error removing token holding:", error);
      return false;
    }
  };

  return (
    <NFTMarketplaceContext.Provider
      value={{
        titleData,
        // checkContract
        walletName,
        checkIfWalletConnected,
        connectWallet,
        disconnectWallet,
        uploadFileToIPFS,
        uploadJSONToPinata,
        unpinFromPinata,
        createNFT,
        transferNFT,
        fetchNFTS,
        fetchMyNFTsOrListedNFTs,
        buyNFT,
        createSale,
        currentAccount,
        setError,
        error,
        openError,
        setOpenError,
        transferEther,
        accountBalance,
        transactionCount,
        transaction,
        loading,
        getAllTransactions,
        cancelMarketItem,
        makeOffer,
        unMakeOffer,
        fetchOffers,
        allOffers,
        acceptOffer,
        // New token holdings and private tags functions
        tokenHoldings,
        updateTokenHolding,
        removeTokenHolding,
        privateTags,
        addPrivateTag,
        removePrivateTag,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};

export default NFTMarketplaceContext;
