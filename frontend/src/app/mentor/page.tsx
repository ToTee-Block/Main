'use client';
import React, { useState } from 'react';
import styles from '@/styles/pages/mentor/mentor.module.scss';
import Image from 'next/image';
import MentorButton from '@/components/button/MentorButton';
import Pagination from '@/components/pagination/custompagination';
import Tag from '@/src/components/tag/tag';
import SearchBox from '@/components/search/SearchBox'; 
import Link from 'next/link';

export default function MentorSearch() {
  const [selectedTags, setSelectedTags] = useState<Array<boolean>>(Array(7).fill(false));
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const tags = ['전체', 'React', 'React', 'React', 'React', 'React', '임시태그'];

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
        <h1 className={styles.title}>ToTee Mentor</h1>
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
          <SearchBox // 사용된 SearchBox 컴포넌트
            onClick={() => console.log('Search button clicked')}
            disabled={false}
          />
        </div>
      </div>

      <div className={styles.mentorGrid}>
        {Array(15).fill(null).map((_, index) => (
          <div key={index} className={styles.mentorCard}>
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
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={100}
      />
    </div>
  );
}