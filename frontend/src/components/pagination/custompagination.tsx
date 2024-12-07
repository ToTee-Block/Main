'use client';

import React from 'react';
import Image from 'next/image';
import styles from '@/styles/components/pagination/pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  onPageChange, 
  totalPages
}) => {
  // 현재 페이지가 속한 그룹의 시작과 끝 페이지 계산
  const currentGroup = Math.ceil(currentPage / 10);
  const startPage = (currentGroup - 1) * 10 + 1;
  const endPage = Math.min(currentGroup * 10, totalPages);

  return (
    <div className={styles.pagination}>
      <button 
        className={`${styles.pageButton} ${styles.iconButton}`}
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <Image
          src="/icon/chevrons_left.svg"
          alt="처음으로"
          width={40}
          height={40}
        />
      </button>
      
      <button 
        className={`${styles.pageButton} ${styles.iconButton}`}
        onClick={() => onPageChange(Math.max(1, startPage - 1))}
        disabled={startPage === 1}
      >
        <Image
          src="/icon/chevron_left.svg"
          alt="이전"
          width={40}
          height={40}
        />
      </button>
      
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
        <button
          key={page}
          className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      
      {/* 다음 페이지 그룹으로 */}
      <button 
        className={`${styles.pageButton} ${styles.iconButton}`}
        onClick={() => onPageChange(Math.min(totalPages, endPage + 1))}
        disabled={endPage === totalPages}
      >
        <Image
          src="/icon/chevron_right.svg"
          alt="다음"
          width={40}
          height={40}
        />
      </button>
      
      <button 
        className={`${styles.pageButton} ${styles.iconButton}`}
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <Image
          src="/icon/chevrons_right.svg"
          alt="마지막으로"
          width={40}
          height={40}
        />
      </button>
    </div>
  );
};

export default Pagination;