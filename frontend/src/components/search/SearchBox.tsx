"use client";

import React, { useState } from "react";
import styles from "@/styles/components/search/searchBox.module.scss";

interface SearchBoxProps {
  // children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  // children,
  onClick,
  disabled = false,
}) => {
  const [searchUrl, setSearchUrl] = useState<string>("");

  return (
    <div
      onClick={onClick}
      className={`${styles.searchBox} ${disabled ? styles.disabled : ""}`}
    >
      <input 
        type="text" 
        placeholder="Search" 
        onChange={(e) => {
          setSearchUrl(`?kw=${e.target.value}`);
          console.log(searchUrl);
        }}
      />
      <a href={searchUrl}><img src="/icon/search.svg" alt="검색 아이콘" /></a>
    </div>
  );
};

export default SearchBox;