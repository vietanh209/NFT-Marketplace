import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

// Icons
import { FiSearch } from "react-icons/fi";
import { IoIosNotifications } from "react-icons/io";
import { CgMenuRight } from "react-icons/cg";
import { RiCloseLine } from "react-icons/ri";

// INTERNAL IMPORT
import Style from "./Navbar.module.css";
import ThemeSwitch from "../theme/ThemeSwitcher";
import { Discover, HelpCenter, Notification, Profile, Sidebar } from "./index";
import { Error } from "../componentsindex";
import images from "../../img";

// UI Components
import { Button, Input, Tooltip } from "@nextui-org/react";

// IMPORT FROM SMART CONTRACT
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";
import ThemeSwitcherText from "../theme/ThemeSwitcherText";
import { useTheme } from "next-themes";

const NavBar = () => {
  const { theme } = useTheme();
  const [discover, setDiscover] = useState(false);
  const [help, setHelp] = useState(false);
  const [notification, setNotification] = useState(false);
  const [profile, setProfile] = useState(false);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Check if page is scrolled for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openMenu = (menuType) => {
    if (menuType === "discover") {
      setDiscover(!discover);
      setHelp(false);
      setNotification(false);
      setProfile(false);
    } else if (menuType === "help") {
      setHelp(!help);
      setDiscover(false);
      setNotification(false);
      setProfile(false);
    } else {
      setDiscover(false);
      setHelp(false);
      setNotification(false);
      setProfile(false);
      setOpenSideMenu(false);
    }
  };

  const openNotification = () => {
    setNotification(!notification);
    setDiscover(false);
    setHelp(false);
    setProfile(false);
  };

  const openProfile = () => {
    console.log("Opening profile dropdown. Current state:", profile, "New state:", !profile);
    setProfile(!profile);
    setHelp(false);
    setDiscover(false);
    setNotification(false);
  };

  const openSideBar = () => {
    setOpenSideMenu(!openSideMenu);
  };

  const handleSearch = (e) => {
    if ((e.key === "Enter" || e.type === "click") && searchQuery.trim() !== "") {
      router.push(`/NFTPage?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const navBarElement = document.querySelector(`.${Style.NavBar}`);
      const profileBtn = document.querySelector(`.${Style.profile_button}`);
      const discoverItem = document.querySelector(`.${Style.navbar_container_right_item}:nth-child(1)`);
      const helpItem = document.querySelector(`.${Style.navbar_container_right_item}:nth-child(2)`);
      const notificationBtn = document.querySelector(`.${Style.icon_button}`);

      // Nếu click không nằm trong navbar hoặc nằm trong navbar nhưng không nằm trong các menu item
      if (!navBarElement?.contains(e.target) || 
          (navBarElement?.contains(e.target) && 
           !e.target.closest(`.${Style.navbar_container_right_dropdown}`) &&
           !profileBtn?.contains(e.target) && 
           !discoverItem?.contains(e.target) && 
           !helpItem?.contains(e.target) && 
           !notificationBtn?.contains(e.target))
      ) {
        setDiscover(false);
        setHelp(false);
        setNotification(false);
        setProfile(false);
        setOpenSideMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // SMART CONTRACT SECTION
  const { currentAccount, connectWallet, openError } = useContext(
    NFTMarketplaceContext
  );

  return (
    <div className={`${Style.NavBar} ${isScrolled ? Style.scrolled : ""}`}>
      <ThemeSwitcherText>
        <div className={Style.navbar_container}>
          <div className={Style.navbar_container_left}>
            <div className={Style.logo}>
              <Link href="/">
                <Image
                  src={images.logo}
                  alt="NFT Marketplace"
                  width={45}
                  height={45}
                  className={Style.logo_img}
                />
              </Link>
            </div>
            <div className={Style.navbar_container_left_box_input}>
              <div className={Style.search_box}>
                <Input
                  isClearable
                  radius="full"
                  placeholder="Search items, collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
                  onClear={() => setSearchQuery("")}
                  startContent={
                    <FiSearch 
                      className={Style.search_icon} 
                      onClick={handleSearch}
                      style={{ cursor: 'pointer' }}
                    />
                  }
                  classNames={{
                    base: Style.search_input_base,
                    inputWrapper: Style.search_input_wrapper,
                    input: Style.search_input,
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className={Style.navbar_container_right}>
            <div className={`${Style.navbar_container_right_item} ${discover ? Style.active : ""}`}>
              <div onClick={(e) => {
                e.stopPropagation();
                openMenu("discover");
              }}>
                <span>Discover</span>
              </div>
              <div 
                className={`${Style.navbar_container_right_dropdown} ${discover ? Style.show_dropdown : Style.hide_dropdown}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Discover setDiscover={setDiscover} />
              </div>
            </div>

            {/* <div className={`${Style.navbar_container_right_item} ${help ? Style.active : ""}`}>
              <div onClick={(e) => {
                e.stopPropagation();
                openMenu("help");
              }}>
                <span>Help Center</span>
              </div>
              <div 
                className={`${Style.navbar_container_right_dropdown} ${help ? Style.show_dropdown : Style.hide_dropdown}`}
                onClick={(e) => e.stopPropagation()}
              >
                <HelpCenter setHelp={setHelp} />
              </div>
            </div> */}

            <div className={`${Style.navbar_container_right_item} ${notification ? Style.active : ""}`}>
              <div onClick={(e) => {
                e.stopPropagation();
                openNotification();
              }}>
                <Tooltip content="Notifications">
                  <button 
                    className={Style.icon_button}
                    aria-label="Notifications"
                  >
                    <IoIosNotifications className={Style.icon} />
                    <span className={Style.notification_badge}>2</span>
                  </button>
                </Tooltip>
              </div>
              <div 
                className={`${Style.navbar_container_right_dropdown} ${notification ? Style.show_dropdown : Style.hide_dropdown}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Notification setNotification={setNotification} />
              </div>
            </div>

            <div className={Style.navbar_container_right_item}>
              <ThemeSwitch />
            </div>

            <div className={Style.navbar_container_right_button}>
              {currentAccount === "" ? (
                <Button
                  color="warning"
                  radius="full"
                  className={Style.connect_button}
                  onClick={() => connectWallet()}
                >
                  Connect Wallet
                </Button>
              ) : (
                <Button
                  color="warning"
                  radius="full"
                  className={Style.create_button}
                  onClick={() => router.push("/uploadNft")}
                >
                  Create NFT
                </Button>
              )}
            </div>

            <div className={`${Style.navbar_container_right_item} ${profile ? Style.active : ""}`}>
              <div onClick={(e) => {
                e.stopPropagation();
                openProfile();
              }}>
                <Tooltip content="Profile">
                  <button 
                    className={Style.profile_button}
                    aria-label="Profile"
                  >
                    <Image
                      src={images.user1}
                      alt="Profile"
                      width={40}
                      height={40}
                      className={Style.profile_image}
                    />
                  </button>
                </Tooltip>
              </div>
              <div 
                className={`${Style.navbar_container_right_dropdown} ${profile ? Style.show_dropdown : Style.hide_dropdown}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Profile currentAccount={currentAccount || "0x1234...5678"} setProfile={setProfile} />
              </div>
            </div>

            <div className={Style.navbar_container_right_menuBtn}>
              <button 
                className={Style.menu_button}
                onClick={openSideBar}
              >
                <CgMenuRight className={Style.menu_icon} />
              </button>
            </div>
          </div>
        </div>

        {openSideMenu && (
          <div className={Style.sideBar}>
            <button className={Style.close_button} onClick={() => setOpenSideMenu(false)}>
              <RiCloseLine />
            </button>
            <Sidebar
              setOpenSideMenu={setOpenSideMenu}
              currentAccount={currentAccount}
              connectWallet={connectWallet}
            />
          </div>
        )}

        {openError && <Error />}
      </ThemeSwitcherText>
    </div>
  );
};

export default NavBar;
