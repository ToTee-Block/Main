"use client";

import styles from "@/styles/components/exception/no-search.module.scss";

interface NoSearchProps {
  // children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const NoSearch: React.FC<NoSearchProps> = ({
  // children,
  disabled = false,
}) => {
  return (
    <div
      className={`${styles.noSearch} ${disabled ? styles.disabled : ""}`}
    >
      <span>검색 결과가 없습니다.</span>
    </div>
  );
};

export default NoSearch;