import React, {useEffect, useState, useContext} from 'react'
import { useRouter } from 'next/router'
// INTERNAL IMPORT 
import { Category, Brand } from "../components/componentsindex" 
import NFTDetailsPage from "../components/NFTDetailsPage/NFTDetailsPage"
import Style from "../styles/NFTDetails.module.css"

//import smart cotract data
const NFTDetails = () => {
  // const {currentAccount} = useContext(NFTMartketplaceContext);

  const [nft, setNfts] = useState({
    imageurl: "",
    tokenId: "",
    name: "",
    owner: "",
    price: "",
    seller: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  
  useEffect(() => {
    if(!router.isReady) return;
    
    setIsLoading(true);
    try {
      setNfts(router.query);
    } catch (error) {
      console.error("Error setting NFT data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router.isReady]);

  return (
    <div className={Style.nftDetails}>
      <div className={Style.nftDetails_container}>
        {isLoading ? (
          <div className={Style.loading}>Loading NFT details...</div>
        ) : (
          <>
            <div className={Style.nftDetails_box}>
              <NFTDetailsPage nft={nft}/>
            </div>
            {/* <Category /> */}
            {/* <Brand /> */}
          </>
        )}
      </div>
    </div>
  )
}

export default NFTDetails