'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/pages/qna/qna.module.scss';
import MentorButton from '@/components/button/MentorButton';
import SearchBox from '@/components/search/SearchBox';
import Pagination from '@/components/pagination/custompagination';

export default function QnA() {
  const [currentPage, setCurrentPage] = useState(1);
  const [userName, setUserName] = useState('');
  const totalPages = 78;
  const itemsPerPage = 10;

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const getCurrentDate = () => {
    const date = new Date();
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const generateQnaItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return Array(itemsPerPage).fill(null).map((_, index) => {
      const itemNumber = startIndex + index + 1;
      return {
        id: itemNumber,
        question: 'ToTee에서 이런 질문을 남겨요.',
        date: getCurrentDate(),
        author: userName || '사용자'
      };
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>ToTee QnA</h1>
      </div>

      <div className={styles.tagSection}>
        <div></div>
        <div className={styles.searchWrapper}>
          <Link href="/qna/myqna" className={styles.linkWrapper}>
            <MentorButton>My Q&A</MentorButton>
          </Link>
          <SearchBox />
        </div>
      </div>

      <div className={styles.content}>
        {generateQnaItems().map((item) => (
          <Link href={`/qna/${item.id}`} key={item.id} className={styles.qnaItem}>
            <div className={styles.numberWrapper}>
              <span className={styles.number}>{String(item.id).padStart(2, '0')}.</span>
            </div>
            <div className={styles.questionWrapper}>
              <span className={styles.question}>{item.question}</span>
            </div>
            <div className={styles.metaWrapper}>
              <span className={styles.date}>{item.date}</span>
              <span className={styles.author}>{item.author}</span>
            </div>
          </Link>
        ))}
      </div>

      

      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
    </div>
  );
}