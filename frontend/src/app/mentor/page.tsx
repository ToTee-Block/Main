'use client';

import React, { useState } from 'react';
import styles from '@/styles/pages/mentor.module.scss';
import Image from 'next/image';
import MentorButton from '@/components/button/MentorButton';
import Pagination from '@/components/pagination/custompagination';

export default function MentorSearch() {
  const [selectedTags, setSelectedTags] = useState<Array<boolean>>(Array(7).fill(false));
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleTagToggle = (index: number): void => {
    setSelectedTags(prev => {
      const newState = [...prev];
      if (index === 0) {
        if (prev[0]) {
          return prev.map(() => false);
        }
        return prev.map((_, i) => i === 0);
      } 
      else {
        newState[0] = false;
        newState[index] = !newState[index];
        return newState;
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>ToTee Mentor</h1>
      </div>

      <div className={styles.tagSection}>
        <div className={styles.tagList}>
          {['전체', 'React', 'React', 'React', 'React', 'React', '임시태그'].map((tag, index) => (
            <label
              key={index}
              className={`${styles.tag} ${selectedTags[index] ? styles.checkedTag : ''}`}
            >
              <input
                type="checkbox"
                className={styles.hiddenCheckbox}
                checked={selectedTags[index]}
                onChange={() => handleTagToggle(index)}
              />
              {tag}
            </label>
          ))}
        </div>

        <div className={styles.searchWrapper}>
          <MentorButton>
            My Mentor
          </MentorButton>
          <div className={styles.searchBar}>
            <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="search"
            className={styles.searchInput}
            />
            <button className={styles.searchButton}>
              <Image
              src="/icon/search.svg"
              alt="search"
              width={40}
              height={40}
              />
              </button>
          </div>
      </div>
      </div>

      <div className={styles.mentorGrid}>
        {Array(15).fill(null).map((_, index) => (
          <div key={index} className={styles.mentorCard}>
            <div className={styles.profileImage} />
            <div className={styles.mentorInfo}>
              <span className={styles.name}>박승우 멘토</span>
              <span className={styles.company}>Google</span>
              <span className={styles.position}>Full-Stack</span>
              <span className={styles.description}>구글의 멘토-서비스를 통함</span>
            </div>
          </div>
        ))}
      </div>

      {/* 여기! 이 부분이 변경되었습니다 */}
      <Pagination 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={100}
      />
    </div>
  );
}