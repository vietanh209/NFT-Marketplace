import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { DateRangePicker } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { Slider, Input, Select, SelectItem } from "@nextui-org/react";

import Style from "./SearchBar.module.css";

const SearchBar = ({
  onHandleSearch,
  onClearSearch,
  onHandleSearchPrice,
  onHandleSort,
  initialSearchValue = "",
}) => {
  const [search, setSearch] = useState("");
  const [searchItem, setSearchItem] = useState(initialSearchValue || "");
  const [priceRange, setPriceRange] = useState([0, 30]);
  const [dateRange, setDateRange] = useState({
    start: parseDate("2024-04-01"),
    end: parseDate("2024-04-08"),
  });

  // Update searchItem when initialSearchValue changes
  useEffect(() => {
    if (initialSearchValue) {
      setSearchItem(initialSearchValue);
    }
  }, [initialSearchValue]);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchItem), 500);
    return () => clearTimeout(timer);
  }, [searchItem]);

  useEffect(() => {
    if (search) {
      onHandleSearch(search);
    } else {
      onClearSearch();
    }
  }, [search]);

  useEffect(() => {
    onHandleSearchPrice(priceRange);
  }, [priceRange]);

  const handleDateChange = (range) => {
    setDateRange(range);
    // You can add date filtering functionality here if needed
  };
  
  return (
    <div className={Style.searchBar}>
      <div className={`${Style.searchBar_box} flex flex-col flex-wrap rounded-xl gap-5 justify-around mt-[3rem] py-5 border p-5`}>
        <div className={Style.search_input_wrapper}>
          <Input
            label="Search NFT Name"
            isClearable
            radius="lg"
            fullWidth
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [],
              innerWrapper: "bg-transparent",
              base: "w-full",
            }}
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            onClear={() => {
              setSearchItem("");
              onClearSearch();
            }}
            placeholder="Type to search..."
            startContent={
              <BsSearch className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
            }
          />
        </div>
        <div className={Style.search_input_wrapper}>
          <Select
            label="Sort Options"
            placeholder="Select sort"
            initialSelectedKeys={['Lowest Price']}
            defaultSelectedKeys={["Lowest Price"]}
            fullWidth
            classNames={{
              base: "w-full",
              trigger: "h-12",
            }}
            onSelectionChange={(keys) => onHandleSort(keys.currentKey)}
          >
            <SelectItem key="Lowest Price">Lowest Price</SelectItem>
            <SelectItem key="Highest Price">Highest Price</SelectItem>
            <SelectItem key="Lowest ID">Lowest ID</SelectItem>
            <SelectItem key="Highest ID">Highest ID</SelectItem>
            <SelectItem key="Last">Last</SelectItem>
          </Select>
        </div>
        <div className={`${Style.search_input_wrapper} relative`}>
          <DateRangePicker
            label="Creation Date Range"
            isRequired
            value={dateRange}
            onChange={handleDateChange}
            defaultValue={{
              start: parseDate("2024-04-01"),
              end: parseDate("2024-04-08"),
            }}
            classNames={{
              base: "w-full",
            }}
          />
        </div>
        <div className={Style.search_input_wrapper}>
          <Slider
            label="Price Range (ETH)"
            step={0.1}
            minValue={0}
            maxValue={100}
            value={priceRange}
            onChange={setPriceRange}
            defaultValue={[0, 30]}
            formatOptions={{ style: "decimal", minimumFractionDigits: 1, maximumFractionDigits: 1 }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
