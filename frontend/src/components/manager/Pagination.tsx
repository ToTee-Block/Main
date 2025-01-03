import React from "react";
import styles from "@/styles/components/manager/pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalItems: number; // 전체 아이템 수로 변경
  itemsPerPage: number; // 페이지당 아이템 수 추가
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageRange = () => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    return `${start}-${end}`;
  };

  return (
    <div className={styles.pagination}>
      <div className={styles.pageInfo}>
        Page {getPageRange()} of {totalItems}
      </div>
      <div className={styles.controls}>
        <button
          className={styles.pageButton}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        <button
          className={styles.pageButton}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
