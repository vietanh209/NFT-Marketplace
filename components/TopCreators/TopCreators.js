export const getTopCreators = (creators) => {
    // Filter out NFTs with no seller (this handles empty or invalid data)
    const validCreators = creators.filter(creator => creator.seller && creator.price);
    
    // Group NFTs by seller
    const finalResults = validCreators.reduce((index, currentValue) => {
        // Create an array for this seller if it doesn't exist yet
        (index[currentValue.seller] = index[currentValue.seller] || []).push(currentValue);
        return index;
    }, {});
    
    // Process each seller's data
    const finalCreators = Object.entries(finalResults).map(([seller, nfts]) => {
        // Calculate total value of all NFTs from this seller
        const total = nfts
            .map((nft) => Number(nft.price))
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
        
        // Get a sample NFT image from this seller for display purposes
        const sampleNft = nfts[0];
        
        return {
            seller,
            total,
            imageurl: sampleNft.imageurl, // Use the first NFT's image as a representative image
            nftCount: nfts.length // Track how many NFTs this seller has listed
        };
    });
    
    // Sort by total value (highest first)
    return finalCreators.sort((a, b) => b.total - a.total);
};