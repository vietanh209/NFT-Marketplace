import React from 'react'
import Image from 'next/image'
import {MdVerified} from 'react-icons/md'
//INTERNAL IMPORT
import Style from './DaysComponents.module.css'
import images from '../../../img'

const DaysComponents = ({el}) => {
  return (
    <div className={Style.daysComponent}>
        <div className={Style.daysComponent_box}>
            <div className={Style.daysComponent_box_img}>
                <Image 
                    src={el.background}
                    className={Style.daysComponent_box_img_img}
                    alt='Collection Cover'
                    width={400}
                    height={300}
                    objectFit='cover'
                />
            </div>
            <div className={Style.daysComponent_box_profile}>
                <Image 
                    src={el.pilot}
                    width={150}
                    height={90}
                    className={Style.daysComponent_box_img_1}
                    alt="NFT 1"
                    objectFit='cover'
                />
                <Image 
                    src={el.cartoon}
                    width={150}
                    height={90}
                    className={Style.daysComponent_box_img_2}
                    alt="NFT 2"
                    objectFit='cover'
                />
                <Image 
                    src={el.temminator}
                    width={150}
                    height={90}
                    className={Style.daysComponent_box_img_3}
                    alt="NFT 3"
                    objectFit='cover'
                />
            </div>
            <div className={Style.daysComponent_box_title}>
                <h2>Amazing Collection</h2>
                <div className={Style.daysComponent_box_title_info}>
                    <div className={Style.daysComponent_box_title_info_profile} >
                        <Image 
                            src={el.user} 
                            alt='Creator'
                            width={30}
                            height={30}
                            objectFit="cover"
                            className={Style.daysComponent_box_title_info_profile_img}
                        />
                        <div>
                            <span>
                                Creator Lucas
                                <MdVerified/>
                            </span>
                        </div>
                    </div>
                    <div className={Style.daysComponent_box_title_info_price}>
                        <small>1.2 ETH</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DaysComponents