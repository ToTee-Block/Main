'use client';

import React, { useState } from 'react';
import styles from '@/styles/pages/mentor.module.scss';
import Image from 'next/image';
import MentorButton from '@/components/button/MentorButton';

export default function MentorSearch() {
  const [selectedTags, setSelectedTags] = useState<Array<boolean>>(Array(7).fill(false));
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleTagToggle = (index: number): void => {
    setSelectedTags(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
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
          <div className={styles.searchBar}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>
              <Image 
                src="/icon/search.svg"
                alt="Search"
                width={20}
                height={20}
              />
            </button>
          </div>
          <MentorButton>
            My Mentor
          </MentorButton>
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

      <div className={styles.pagination}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
          <button
            key={page}
            className={`${styles.pageButton} ${page === currentPage ? styles.activePage : ''}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}