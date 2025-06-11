import React, { useEffect, useState, useContext } from 'react'

import Style from '../styles/uploadNFT.module.css'
import {UploadNFT} from '../components/uploadNFT/UploadNFTIndex'
import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext'
import ThemeSwitcherText from '../components/theme/ThemeSwitcherText'

const uploadNft = () => {
  const { uploadFileToIPFS, createNFT } = useContext(NFTMarketplaceContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập thời gian loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={Style.uploadNft}>
      <ThemeSwitcherText>
        {loading ? (
          <div className={Style.loading_container}>
            <div className={Style.loading_spinner}></div>
            <p>Loading create NFT page...</p>
          </div>
        ) : (
          <div className={Style.uploadNft_box}>
            <div className={Style.uploadNft_box_heading}>
              <h1>Create an NFT</h1>
              <p>Once your item is minted you will not be able to change any of its information.</p>
            </div>
            <div className={Style.uploadNft_box_form}>
              <UploadNFT 
                uploadFileToIPFS={uploadFileToIPFS}
                createNFT={createNFT}
              />
            </div>
          </div>
        )}
      </ThemeSwitcherText>
    </div>
  )
}

export default uploadNft