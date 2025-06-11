import React from 'react'
import Image from 'next/image'
import Style from '../Footer/Footer.module.css'
import {
  TiSocialFacebook, TiSocialLinkedin, TiSocialTwitter, TiSocialYoutube, TiSocialInstagram
} from 'react-icons/ti';
import { FaDiscord, FaArrowUp } from 'react-icons/fa';
import { RiSendPlaneFill } from 'react-icons/ri';

// INTERNAL IMPORT
import images from '../../img'
import { Discover, HelpCenter } from '../NavBar/index';

const Footer = () => {
  return (
    <div className={Style.footer}>
      <div className={Style.footer_box}>
        <div className={Style.footer_box_social}>
          <Image src={images.logo} alt='footer logo' height={100} width={100} />
          <p>
            A non-fungible token is a unique digital identifier that is recorded on
            a blockchain and is used to certify ownership and authenticity.
            It cannot be copied, substituted, or subdivided. The ownership of an NFT is recorded in the blockchain and can be transferred by the owner, allowing NFTs to be sold and traded.
          </p>
          <div className={Style.footer_social}>
            <a href="#" className={Style.social_icon}>
              <TiSocialFacebook />
            </a>
            <a href="#" className={Style.social_icon}>
              <TiSocialLinkedin />
            </a>
            <a href="#" className={Style.social_icon}>
              <TiSocialTwitter />
            </a>
            <a href="#" className={Style.social_icon}>
              <TiSocialYoutube />
            </a>
            <a href="#" className={Style.social_icon}>
              <TiSocialInstagram />
            </a>
            <a href="#" className={Style.social_icon}>
              <FaDiscord />
            </a>
            <a href="#" className={Style.social_icon}>
              <FaArrowUp />
            </a>
          </div>
        </div>

        <div className={Style.footer_box_discover}>
          <h3>Discover</h3>
          <div className={Style.footer_menu}>
            <ul>
              <li><a href="#">Transfer</a></li>
              <li><a href="#">NFTs</a></li>
              <li><a href="#">Author Profile</a></li>
              <li><a href="#">Upload NFT</a></li>
              <li><a href="#">Connect Wallet</a></li>
            </ul>
          </div>
        </div>

        <div className={Style.footer_box_help}>
          <h3>Help Center</h3>
          <div className={Style.footer_menu}>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Sign Up</a></li>
              <li><a href="#">Sign In</a></li>
              <li><a href="#">Subscription</a></li>
            </ul>
          </div>
        </div>

        <div className={Style.subscribe}>
          <h3>Subscribe</h3>
          <div className={Style.subscribe_box}>
            <input type="email" placeholder='Enter your email' />
            <button className={Style.subscribe_box_btn}>
              <RiSendPlaneFill className={Style.subscribe_box_send} />
            </button>
          </div>
          <div className={Style.subscribe_box_info}>
            <p>
              Discover, collect, and sell extraordinary NFTs
              <br />OpenSea is the first largest NFT marketplace
            </p>
          </div>
        </div>
      </div>
      
      <div className={Style.footer_bottom}>
        <div className={Style.footer_bottom_container}>
          <p>© 2023 NFT Marketplace. All rights reserved.</p>
          <div className={Style.footer_bottom_links}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer