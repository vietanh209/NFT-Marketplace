import React, {useState, useEffect, useContext } from 'react';
import Style from '../styles/index.module.css';
import { 
  HeroSection, 
  Service, 
  BigNFTSlider, 
  Subscribe, 
  Title, 
  Category, 
  Filter, 
  NFTCard, 
  Collection,
  FollowerTab, 
  AudioLive, 
  LikeProfile, 
  Slider, 
  Brand, 
  Video, 
  Loader
} from '../components/componentsindex';

// IMPORT CONTRACT DATA
import {NFTMarketplaceContext} from '../Context/NFTMarketplaceContext';
import { getTopCreators } from '../components/TopCreators/TopCreators';

const Home = () => {
  const {fetchNFTS} = useContext(NFTMarketplaceContext);
  const [nfts, setNfts] = useState([]);
  const [nftCopy, setNFTCoppy] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [creators, setCreators] = useState([]);
  
  const {checkIfWalletConnected} = useContext(NFTMarketplaceContext);
  
  useEffect(() => {
    checkIfWalletConnected();
  }, []);
  
  useEffect(() => {
    const loadNFTs = async () => {
      setIsLoading(true);
      try {
        const items = await fetchNFTS();
        setNfts(items);
        setNFTCoppy(items);
        
        // Generate top creators based on these NFTs
        const topCreatorsList = getTopCreators(items);
        setCreators(topCreatorsList);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNFTs();
  }, [fetchNFTS]); 

  return (
    <div className={Style.homePage}>
      {/* Hero Section with Banner */}
      <div className={Style.heroContainer}>
        <HeroSection />
      </div>
      
      {/* Services Highlights */}
      <div className={Style.sectionContainer}>
        <Service/>
      </div>
      
      {/* Featured NFT Slider */}
      <div className={Style.sliderContainer}>
        <BigNFTSlider/>
      </div>
      
      {/* Latest NFTs Section */}
      <div className={Style.sectionContainer}>
        <Title 
          heading="Trending NFTs" 
          paragraph="Recently listed NFTs on our marketplace"
        />
        <div className={Style.nftContainer}>
          {isLoading ? (
            <Loader/>
          ) : nfts.length === 0 ? (
            <p className={Style.noItems}>No NFTs listed yet. Be the first to create one!</p>
          ) : (
            <NFTCard NFTData={nfts.slice(0, 8)} /> 
          )}
        </div>
      </div>
      
      {/* Top Creators Section */}
      <div className={Style.creatorsSection}>
        <Title 
          heading="Top Creators" 
          paragraph="Discover the leading NFT creators on our marketplace"
        />
        {isLoading ? (
          <Loader/>
        ) : creators.length === 0 ? (
          <p className={Style.noItems}>No creators to display yet. Start creating NFTs!</p>
        ) : (
          <FollowerTab TopCreators={creators}/>
        )}
      </div>
      
      {/* Categories Section */}
      <div className={Style.categoriesContainer}>
        <Title 
          heading="Browse by Category" 
          paragraph="Explore NFTs in featured categories"
        />
        <Category/>
      </div>
      
      {/* Featured Collections */}
      <div className={Style.sectionContainer}>
        <Title 
          heading="Featured Collections" 
          paragraph="Explore our curated collections from top artists"
        />
        <Collection/>
      </div>
      
      {/* Audio NFTs Section */}
      <div className={Style.audioSection}>
        <Title 
          heading="Audio Collections" 
          paragraph="Discover outstanding audio NFTs from talented creators"
        />
        <AudioLive/>
      </div>
      
      {/* Trending Artists Slider */}
      <div className={Style.sliderSection}>
        <Slider/>
      </div>
      
      {/* Newsletter Subscription */}
      <div className={Style.subscribeContainer}>
        <Subscribe/>
      </div>
      
      {/* Brand Partners */}
      <div className={Style.brandSection}>
        <Brand/>
      </div>
    </div>
  );
};

export default Home;
