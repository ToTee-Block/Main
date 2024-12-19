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

  const movePage = async () => {
    const movedPage = searchUrl;
    setSearchUrl("");
    location.href = `?kw=${movedPage}`;
  };

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
        }}
      />
      <button onClick={movePage}>
        <img src="/icon/search.svg" alt="검색 아이콘" />
      </button>
    </div>
  );
};

export default SearchBox;
