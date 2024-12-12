'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/pages/mentor/mymentor.module.scss';
import MentorButton from '@/components/button/MentorButton';
import Pagination from '@/components/pagination/custompagination';
import Tag from '@/components/tag/tag';
import SearchBox from '@/components/search/SearchBox';

export default function MyMentor() {
  const [selectedTags, setSelectedTags] = useState<Array<boolean>>(Array(8).fill(false));
  const [currentPage, setCurrentPage] = useState(1);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const tags = ['전체', 'React', 'React', 'React', 'React', 'React', 'React', '임시저장'];

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>{userName ? `${userName}의 Mentor` : '사용자의 Mentor'}</h1>
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
          <Link href="/mentor/mymentor" className={styles.linkWrapper}>
            <MentorButton>
              My Mentor
            </MentorButton>
          </Link>
          <SearchBox
            onClick={() => console.log('Search clicked')}
            disabled={false}
          />
        </div>
      </div>

      <div className={styles.mentorGrid}>
  {Array(5).fill(null).map((_, index) => (
    <Link href="/mentor/detail" key={index} className={styles.mentorCard}>
      <div className={styles.profileImage} />
      <div className={styles.mentorInfo}>
        <div className={styles.nameWrapper}>
          <span className={styles.nameText}>박승우</span>
          <span className={styles.mentorText}>멘토</span>
        </div>
        <div className={styles.infoWrapper}>
          <span className={styles.company}>Google</span>
          <span className={styles.position}>Full-Stack</span>
        </div>
        <div className={styles.descriptionWrapper}>
          <span className={styles.description}>구글의 모든 서비스를 총괄</span>
        </div>
      </div>
    </Link>
  ))}
</div>

      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={78}
      />
    </div>
  );
}