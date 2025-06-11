const { ethers } = require("hardhat");

async function main() {
    try {
        // 1. Deploy NFT contract
        const NFT = await ethers.getContractFactory("NFT");
        const nft= await NFT.deploy();
        await nft.deployed();
        console.log(`NFT contract deployed to address: ${nft.address}`);

        // 2. Deploy TransferFunds first since it has no dependencies
        const TransferFunds = await ethers.getContractFactory("TransferFunds");
        const transferFunds = await TransferFunds.deploy();
        await transferFunds.deployed();
        console.log(`TransferFunds contract deployed to address: ${transferFunds.address}`);
        
        // 3. Deploy NFTAuction with TransferFunds address
        const NFTAuction = await ethers.getContractFactory("NFTAuction");
        const nftAuction = await NFTAuction.deploy(transferFunds.address);
        await nftAuction.deployed();
        console.log(`NFT Auction contract deployed to address: ${nftAuction.address}`);
        
        // 4. Deploy NFTMarketplace with NFTAuction and TransferFunds addresses
        const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
        const nftMarketplace = await NFTMarketplace.deploy(nftAuction.address, transferFunds.address);
        await nftMarketplace.deployed();
        console.log(`NFTMarketplace contract deployed to address: ${nftMarketplace.address}`);

        console.log("Deployment completed successfully!");
        console.log("-----------------------------------");
        console.log(`NFT: ${nft.address}`);
        console.log(`TransferFunds: ${transferFunds.address}`);
        console.log(`NFTAuction: ${nftAuction.address}`);
        console.log(`NFTMarketplace: ${nftMarketplace.address}`);
    } catch (error) {
        console.error("Deployment failed:", error);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error("Error in main function:", error);
    process.exit(1);
});