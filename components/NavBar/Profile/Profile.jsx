import React from 'react';
import Image from 'next/image';
import {FaUserAlt, FaRegImage, FaUserEdit} from 'react-icons/fa';
import {MdHelpCenter} from 'react-icons/md';
import {TbDownload} from 'react-icons/tb';
import Link from "next/link"
// INTERNAL IMPORT
import Style from './Profile.module.css';
import images from '../../../img';
import { useContext } from 'react';
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';

const Profile = ({currentAccount, setProfile}) => {
  // Lấy context từ NFT Marketplace
  const { connectWallet } = useContext(NFTMarketplaceContext);

  // Xử lý sự kiện khi click vào menu item
  const handleItemClick = (e) => {
    // Đóng dropdown sau khi chọn menu
    setTimeout(() => {
      if (setProfile) {
        setProfile(false);
      }
    }, 100);
  };

  // Xử lý sự kiện khi click vào Disconnect
  const handleDisconnect = (e) => {
    e.preventDefault();
    if (window.ethereum) {
      console.log("Disconnecting wallet...");
      // Đóng dropdown
      if (setProfile) {
        setProfile(false);
      }
      // Làm mới trang
      window.location.reload();
    }
  };

  return (
    <div className={Style.profile}>
      <div className={Style.profile_account}>
        <Image src={images.user1} alt='user profile'
          width={50}
          height={50}
          className={Style.profile_account_img}
        />
        <div className={Style.profile_account_info}>
          <p>daniel</p>
          <small>{currentAccount && currentAccount.length > 18 ? `${currentAccount.slice(0, 18)}...` : currentAccount || "Not connected"}</small>
        </div>
      </div>
      <div className={Style.profile_menu}>
          <div className={Style.profile_menu_one}>
            <div className={Style.profile_menu_one_item} onClick={handleItemClick}>
              <FaUserAlt/>
              <p>
                <Link href={{pathname: '/author'}}>My Profile</Link>
              </p>
            </div>
            <div className={Style.profile_menu_one_item} onClick={handleItemClick}>
              <FaUserEdit/>
              <p>
                <Link href={{pathname: '/account'}}>Edit Profile</Link>
              </p>
            </div>
          </div>
          <div className={Style.profile_menu_two}>
            <div className={Style.profile_menu_one_item} onClick={handleItemClick}>
              <MdHelpCenter/>
              <p>
                <Link href={{pathname: '/contactus'}}>Help</Link>
              </p>
            </div>
            <div className={Style.profile_menu_one_item} onClick={handleItemClick}>
              <FaRegImage/>
              <p>
                <Link href={{pathname: '/aboutus'}}>My Items</Link>
              </p>
            </div>
            <div className={Style.profile_menu_one_item} onClick={handleDisconnect}>
              <TbDownload/>
              <p>
                <a href="#">Disconnect</a>
              </p>
            </div>
          </div>
      </div>
    </div>
  )
}

export default Profile