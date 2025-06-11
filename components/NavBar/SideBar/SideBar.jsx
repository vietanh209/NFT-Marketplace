import React , {useState}from 'react'
import Link from 'next/link'
import {GrClose} from 'react-icons/gr'
import Image from 'next/image';

import {TiSocialFacebook, TiSocialLinkedin, TiSocialTwitter, TiSocialYoutube, TiSocialInstagram, TiArrowSortedDown, TiArrowSortedUp} from 'react-icons/ti';
import {FaUserAlt, FaRegImage, FaUserEdit} from 'react-icons/fa';
import {MdHelpCenter} from 'react-icons/md';
import {TbDownload} from 'react-icons/tb';

// INTERNAL INPUT
import Style from './SideBar.module.css';
import images from "../../../img";
import Button from '../../Button/Button';
import { useRouter } from 'next/router';

const SideBar = ({setOpenSideMenu, currentAccount, connectWallet}) => {
  const [openDiscover, setOpenDiscover] = useState(false);
  const [openHelp, setopenHelp] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const router = useRouter();
  // DICOVER NAVIGATION
  const discover = [
    {
      name: "TransferFunds",
      link: "transferFunds"
    },
    {
      name: "Collection",
      link: "collection"
    },
    {
      name: "Search",
      link: "Search"
    },
    {
      name: "Author Profile",
      link: "author-profile"
    },
    {
      name: "Account Setting",
      link: "account-setting"
    },
    {
      name: "Connect Wallet",
      link: "connect-wallet"
    },
    {
      name: "Blog",
      link: "blog"
    },
  ];
  // HELP CENTER
  const helpCenter = [
    {
      name: "About",
      link: "about"
    },
    {
      name: "Contact Us",
      link: "contact-us"
    },
    {
      name: "About",
      link: "about"
    },
    {
      name: "Sign Up",
      link: "sign-up"
    },
    {
      name: "Sign In",
      link: "sign-in"
    },
    {
      name: "Subscription",
      link: "subscription"
    },
  ];

  // PROFILE MENU
  const profileMenu = [
    {
      name: "My Profile",
      link: "author",
      icon: <FaUserAlt />
    },
    {
      name: "Edit Profile",
      link: "account",
      icon: <FaUserEdit />
    },
    {
      name: "Help",
      link: "contactus",
      icon: <MdHelpCenter />
    },
    {
      name: "My Items",
      link: "aboutus",
      icon: <FaRegImage />
    },
    {
      name: "Disconnect",
      link: "disconnect",
      icon: <TbDownload />
    },
  ];

  const openDiscoverMenu = () => {
    if(!openDiscover){
      setOpenDiscover(true)
    }
    else{
      setOpenDiscover(false)
    }
  };
  const openHelpMenu = () => {
    if(!openHelp){
      setopenHelp(true)
    }else{
      setopenHelp(false)
    }
  };

  const openProfileMenu = () => {
    if(!openProfile){
      setOpenProfile(true)
    }else{
      setOpenProfile(false)
    }
  };

  const closeSideBar = () => {
    setOpenSideMenu(false);
  };
  return (
    <div className={Style.SideBar}>
      <GrClose className={Style.SideBar_closeBtn} onClick={() => closeSideBar()} />

      <div className={Style.SideBar_box}>
        <Image src={images.logo} alt= "logo"
        with={50} 
        height={50}/>
       <p>Discover the most ourstanding articles on all topices of NFT  </p>
       <div className={Style.SideBar_social}>
        <a href="#">
          <TiSocialFacebook/>
        </a>
        <a href="#">
          <TiSocialLinkedin/>
        </a>
        <a href="#">
          <TiSocialTwitter/>
        </a>
        <a href="#">
          <TiSocialYoutube/>
        </a>
        <a href="#">
          <TiSocialInstagram/>
        </a>
        <a href="#">
          <TiArrowSortedDown/>
        </a>
        <a href="#">
          <TiArrowSortedUp/>
        </a>
       </div>
      </div>
      <div className={Style.SideBar_menu}>
        <div>
          <div className={Style.SideBar_menu_box} 
          onClick={() => openDiscoverMenu() }>
            <p>DISCOVER</p>  
            <TiArrowSortedDown/>  
          </div>
          {
            openDiscover && (
              <div className={Style.SideBar_discover}>
                {discover.map((el, i) => (
                  <Link href={{pathname: `${el.link}`}} key={i + 1}>
                    <p>{el.name}</p>
                  </Link>
                ))}
              </div>
            )
          }
        </div>
        <div>
          <div className={Style.SideBar_menu_box} onClick={() => openHelpMenu()}>
            <p>HELP CENTER</p>
            <TiArrowSortedDown/>
          </div>
          {openHelp && (
              <div className={Style.SideBar_discover}>
                {helpCenter.map((el, i) => (
                  <Link href={{pathname: `${el.link}`}} key={i + 1}>
                    <p>{el.name}</p>
                  </Link>
                ))}
              </div>
          )}
        </div>
        
        {currentAccount && (
          <div>
            <div className={Style.SideBar_menu_box} onClick={() => openProfileMenu()}>
              <p>PROFILE</p>
              <TiArrowSortedDown/>
            </div>
            {openProfile && (
                <div className={Style.SideBar_discover}>
                  {profileMenu.map((el, i) => (
                    <Link href={{pathname: `${el.link}`}} key={i + 1}>
                      <div className={Style.SideBar_profile_item}>
                        <span>{el.icon}</span>
                        <p>{el.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
            )}
          </div>
        )}
      </div>
      <div className={Style.SideBar_button}>
        {currentAccount == "" 
              ? (<Button btnName="Connect Wallet" handleClick={() => connectWallet()}/> )
              : (
                <Button btnName="Create" handleClick={() => router.push("/uploadNft")}/>
                )
          }
      </div>
    </div>
  )
}

export default SideBar