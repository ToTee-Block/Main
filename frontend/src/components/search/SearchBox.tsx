"use client";
import React, { useState, useEffect } from "react";
import styles from "@/styles/components/search/searchBox.module.scss";

interface SearchBoxProps {
  onClick?: () => void;
  disabled?: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onClick, disabled = false }) => {
  const [searchUrl, setSearchUrl] = useState<string>("");

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      location.href = `?kw=${searchUrl}`;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`${styles.searchBox} ${disabled ? styles.disabled : ""}`}
    >
      <input
        type="text"
        placeholder="Search"
        onKeyDown={handleKeyPress}
        onChange={(e) => {
          setSearchUrl(e.target.value);
        }}
      />
      <a
        onClick={() => {
          location.href = `?kw=${searchUrl}`;
        }}
      >
        <img src="/icon/search.svg" alt="검색 아이콘" />
      </a>
    </div>
  );
};

export default SearchBox;
