"use client";

import React, { useState } from "react";
import styles from "@/styles/components/search/searchBox.module.scss";

interface SearchBoxProps {
  onClick: (query: string) => void;
  disabled?: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onClick, disabled = false }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = () => {
    if (onClick) {
      onClick(searchQuery);
    }
    setSearchQuery("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={`${styles.searchBox} ${disabled ? styles.disabled : ""}`}>
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        disabled={disabled}
      />
      <button onClick={handleSearch} disabled={disabled}>
        <img src="/icon/search.svg" alt="검색 아이콘" />
      </button>
    </div>
  );
};

export default SearchBox;
