import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

// INTERNAL IMPORT
import Style from "../styles/serachPage.module.css";
import { Loader } from "../components/componentsindex";
import { SearchBar } from "../components/searchPage/searchPageIndex";
import { Filter } from "../components/componentsindex";
import { NFTCardTwo } from "../components/collectionPage/collectionIndex";
//IMPORT SMART CONTRACT
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const NFTPage = () => {
  const router = useRouter();
  const { search } = router.query;
  
  const { fetchNFTS } = useContext(NFTMarketplaceContext);
  const [nfts, setNfts] = useState([]);
  const [nftCopy, setNFTCoppy] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const loadNFTs = async () => {
      setIsLoading(true);
      try {
        const items = await fetchNFTS();
        if (items && items.length > 0) {
          setNfts(items.reverse());
          setNFTCoppy(items);
        }
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNFTs();
  }, []);

  // Handle search from URL parameter
  useEffect(() => {
    if (search && nftCopy.length > 0) {
      setSearchValue(search);
      onHandleSearch(search);
    }
  }, [search, nftCopy]);

  const onHandleSearch = (value) => {
    if (!value) {
      setNfts(nftCopy);
      return;
    }
    
    const filteredNFTS = nftCopy.filter((nft) => 
      nft.name?.toLowerCase().includes(value.toLowerCase()) ||
      nft.description?.toLowerCase().includes(value.toLowerCase())
    );
    
    setNfts(filteredNFTS);
  };

  // Handle search by selected categories
  const onHandleSelect = (selectedCategories) => {
    if (selectedCategories.includes("All")) {
      // If "All" is selected, show all NFTs
      setNfts(nftCopy);
    } else if (selectedCategories.length === 0) {
      // If nothing selected, reset to original list
      setNfts(nftCopy);
    } else {
      // Filter NFTs based on selected categories
      const filteredNFTS = nftCopy.filter(({ category }) =>
        selectedCategories.includes(category)
      );
      setNfts(filteredNFTS);
    }
  };

  const onHandleSearchPrice = (value) => {
    const [minPrice, maxPrice] = value;
    const filteredNFTS = nftCopy.filter((nft) => {
      const price = parseFloat(nft.price);
      return price >= minPrice && price <= maxPrice;
    });
    
    setNfts(filteredNFTS);
  };

  const onClearSearch = () => {
    if (nftCopy.length) {
      setNfts(nftCopy);
      setSearchValue("");
      // Clear the search parameter from URL without page reload
      router.replace("/NFTPage", undefined, { shallow: true });
    }
  };

  // select sort by price
  const onHandleSort = (key) => {
    let sortedNFTS = [...nfts];
    
    switch (key) {
      case "Lowest Price":
        sortedNFTS.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "Highest Price":
        sortedNFTS.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "Lowest ID":
        sortedNFTS.sort((a, b) => parseInt(a.tokenId) - parseInt(b.tokenId));
        break;
      case "Highest ID":
        sortedNFTS.sort((a, b) => parseInt(b.tokenId) - parseInt(a.tokenId));
        break;
      case "Last":
        sortedNFTS.reverse();
        break;
      default:
        break;
    }
    
    setNfts([...sortedNFTS]);
  };

  return (
    <div className={Style.searchPage}>
      <div className="flex w-[90%] m-auto max-sm:flex-col gap-5">
        <div className="w-1/3 max-md:w-1/2 max-sm:w-full">
          <SearchBar
            onHandleSearch={onHandleSearch}
            onClearSearch={onClearSearch}
            onHandleSearchPrice={onHandleSearchPrice}
            onHandleSort={onHandleSort}
            initialSearchValue={searchValue}
          />
          <Filter nftCopy={nftCopy} onHandleSelect={onHandleSelect} />
        </div>
        <div className="w-3/4 max-md:w-1/2 max-sm:w-full">
          {isLoading ? <Loader /> : <NFTCardTwo NFTData={nfts} />}
        </div>
      </div>
    </div>
  );
};

export default NFTPage;
