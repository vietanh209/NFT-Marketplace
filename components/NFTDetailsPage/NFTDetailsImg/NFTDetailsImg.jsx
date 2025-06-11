import React, { useState } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import Style from "./NFTDetailsImg.module.css";
import { useTheme } from "next-themes";
import { Button, Image } from "@nextui-org/react";
import { GoHeart } from "react-icons/go";
import { FaCamera } from "react-icons/fa";

const NFTDetailsImg = ({ nft }) => {
  const [description, setDescription] = useState(true);
  const [details, setDetails] = useState(true);
  const [like, setLike] = useState(false);
  const { theme } = useTheme();
  const Theme = theme === "light" ? "text-black" : "text-white";
  
  const openDescription = () => {
    setDescription(!description);
  };

  const openDetails = () => {
    setDetails(!details);
  };

  const likeNFT = () => {
    setLike(!like);
  };
  
  const handleViewImage = () => {
    const photoUrl = nft.imageurl;
    window.open(photoUrl, "_blank");
  };
  
  return (
    <div className={Style.NFTDetailsImg}>
      <div className={Style.NFTDetailsImg_box}>
        <div className={Style.NFTDetailsImg_box_NFT}>
          <div className={Style.NFTDetailsImg_box_NFT_like}>
            <Button
              className={Style.viewButton}
              isIconOnly
              color="warning"
              size="sm"
              aria-label="View image"
              onClick={handleViewImage}
            >
              <FaCamera size={20} />
            </Button>
            <div onClick={likeNFT} className={Style.likeContainer}>
              <span>{like ? 27 : 26}</span>
              <Button
                isIconOnly
                color="danger"
                aria-label="Like"
                size="sm"
                endContent={<GoHeart size={19} />}
                className={Style.likeButton}
              ></Button>
            </div>
          </div>
          
          <div className={Style.NFTDetailsImg_box_NFT_img}>
            <Image
              isBlurred
              src={nft.imageurl}
              className={Style.nftImage}
              alt="NFT image"
              width={700}
              height={800}
              radius="md"
              objectFit="cover"
            />
          </div>
        </div>
        
        <div className={Style.NFTDetailsImg_box_accordion}>
          <div
            className={Style.NFTDetailsImg_box_description}
            onClick={openDescription}
          >
            <p className={Theme}>Description</p>
            {description ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
          </div>
          
          {description && (
            <div className={Style.NFTDetailsImg_box_description_box}>
              <p className={Theme}>{nft.description || "No description available"}</p>
            </div>
          )}
        </div>
        
        <div className={Style.NFTDetailsImg_box_accordion}>
          <div
            className={Style.NFTDetailsImg_box_details}
            onClick={openDetails}
          >
            <p className={Theme}>Details</p>
            {details ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
          </div>
          
          {details && (
            <div className={Style.NFTDetailsImg_box_details_box}>
              <small>2000 x 2000 px.IMAGE(658kb)</small>
              <p className={Theme}>
                <small>Contract Address</small>
                <br />
                {nft.seller || "Not available"}
              </p>
              <p className={Theme}>
                <small>Token ID</small>
                <br />
                {nft.tokenId || "Not available"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTDetailsImg;
