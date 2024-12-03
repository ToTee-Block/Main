'use client';

import React, { useState } from 'react';
import styles from '@/styles/pages/mentorform.module.scss'
import Image from 'next/image';
import MentorButton from '@/components/button/MentorButton';

export default function MentorForm() {
  const [isApplyDisabled, setIsApplyDisabled] = useState(false);
  const [isReapplyDisabled, setIsReapplyDisabled] = useState(false);

  const handleApplyClick = () => {
    // 신청 버튼 클릭 시 동작 구현
    setIsApplyDisabled(true);
  };

  const handleReapplyClick = () => {
    // 재신청 버튼 클릭 시 동작 구현
    setIsReapplyDisabled(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>Mentor profile</h1>
        <div className={styles.divider} />
      </div>
      
      <div className={styles.profileContainer}>
        <div className={styles.imageWrapper}>
          <Image 
            src="/icon/user.svg" 
            alt="Profile" 
            width={80} 
            height={80} 
            className={styles.profileImage}
          />
        </div>
        <div className={styles.iconGroup}>
          <button className={styles.iconButton}>
            <Image 
              src="/icon/basicimage.svg" 
              alt="Upload" 
              width={32} 
              height={32}
            />
          </button>
          <button className={styles.iconButton}>
            <Image 
              src="/icon/trash.svg" 
              alt="Delete" 
              width={32} 
              height={32}
            />
          </button>
        </div>
        <p className={styles.imageGuide}>한줄 소개를 입력해주세요.</p>
      </div>

      <div className={styles.formBox}>
        <h3 className={styles.boxTitle}>자기소개</h3>
        <textarea 
          className={styles.textarea}
          placeholder="입력해주세요."
        />
      </div>

      <div className={styles.formBox}>
        <h3 className={styles.boxTitle}>기술 스택</h3>
        <div className={styles.tagContainer}>
          {Array(16).fill('Text').map((text, index) => (
            <span key={index} className={styles.tag}>{text}</span>
          ))}
        </div>
      </div>

      <div className={styles.formBox}>
        <h3 className={styles.boxTitle}>포트폴리오 주소</h3>
        <input 
          type="text" 
          className={styles.input}
          placeholder="입력해주세요."
        />
      </div>

        <div className={styles.buttonWrapper}>
        <div className={styles.submitButton}>
          <MentorButton onClick={handleApplyClick} disabled={isApplyDisabled}>
            신청
          </MentorButton>
        </div>
        <div className={styles.submitButton}>
          <MentorButton onClick={handleReapplyClick} disabled={isReapplyDisabled}>
            재신청
          </MentorButton>
        </div>
      </div>
    </div>
  );
}