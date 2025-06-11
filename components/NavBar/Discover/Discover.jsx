import React from "react";
import Link from "next/link";
import Style from "./Discover.module.css";

const Discover = ({ setDiscover }) => {
  const handleItemClick = () => {
    if (setDiscover) {
      setTimeout(() => {
        setDiscover(false);
      }, 100);
    }
  };
  
  const discoverItems = [
    {
      name: "Transfer",
      link: "transferFunds",
      description: "Transfer tokens between wallets"
    },
    {
      name: "NFTs",
      link: "NFTPage",
      description: "Explore all NFTs"
    },
    {
      name: "Author Profile",
      link: "author",
      description: "View your profile"
    },
    {
      name: "Upload NFT",
      link: "uploadNft",
      description: "Create and upload new NFTs"
    },
    {
      name: "Connect Wallet",
      link: "connectWallet",
      description: "Connect your crypto wallet"
    },
  ];
  
  return (
    <div className={Style.discover}>
      <div className={Style.list}>
        {discoverItems.map((item, i) => (
          <Link
            href={{ pathname: `${item.link}` }}
            className={Style.link}
            key={i}
            onClick={handleItemClick}
          >
            <div className={Style.item}>
              <span className={Style.itemName}>{item.name}</span>
              <span className={Style.itemDescription}>{item.description}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Discover;
