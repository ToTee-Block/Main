'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/pages/qna/myqna.module.scss';
import MentorButton from '@/components/button/MentorButton';
import SearchBox from '@/components/search/SearchBox';
import Pagination from '@/components/pagination/custompagination';
import Tag from '@/components/tag/tag';

export default function QnA() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [userName, setUserName] = useState('');
  const [selectedTags, setSelectedTags] = useState<Array<boolean>>(Array(8).fill(false));
  const [isLoading, setIsLoading] = useState(true);
  const totalPages = 78;
  const itemsPerPage = 5;

  useEffect(() => {
    // 초기 인증 체크
    const checkAuth = () => {
      const storedName = localStorage.getItem('name');
      if (!storedName) {
        alert('로그인이 필요한 서비스입니다.');
        router.push('/members');
        return;
      }
      setUserName(storedName);
      setIsLoading(false);
    };

    checkAuth();

    // storage 이벤트 리스너
    const handleStorageChange = () => {
      const storedName = localStorage.getItem('name');
      if (!storedName) {
        alert('로그인이 필요한 서비스입니다.');
        router.push('/members');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router]);

  if (isLoading) {
    return null;
  }

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

  const handleTagToggle = (index: number): void => {
    setSelectedTags(prev => {
      const newState = [...prev];
      if (index === 0) {
        if (prev[0]) {
          return prev.map(() => false);
        }
        return prev.map((_, i) => i === 0);
      } else {
        newState[0] = false;
        newState[index] = !newState[index];
        return newState;
      }
    });
  };

  const tags = ['전체', 'React', 'React', 'React', 'React', 'React', 'React', '임시저장'];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>{userName ? `${userName}의 QnA` : '사용자의 QnA'}</h1>
          <div className={styles.titleLine}></div>
        </div>
      </div>

      <div className={styles.tagSection}>
        <Tag
          tags={tags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />
        <div className={styles.searchWrapper}>
          <Link href="/qna/write" className={styles.linkWrapper}>
            <MentorButton>질문하기</MentorButton>
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

      <div className={styles.paginationWrapper}>
        <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}