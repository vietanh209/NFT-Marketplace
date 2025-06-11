import React from 'react'

import {NFTDescription, NFTDetailsImg} from './NFTDetailsIndex'
import Style from './NFTDetailsPage.module.css'

const NFTDetailsPage = ({nft}) => {
  return (
    <div className={Style.NFTDetailsPage}>
      <div className={Style.NFTDetailsPage_box}>
        <div className={Style.NFTDetailsPage_box_left}>
          <NFTDetailsImg nft={nft}/>
        </div>
        <div className={Style.NFTDetailsPage_box_right}>
          <NFTDescription nft={nft}/>
        </div>
      </div>
    </div>
  )
}

export default NFTDetailsPage