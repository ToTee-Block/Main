'use client';

import React, { useState } from 'react';
import styles from '@/styles/pages/mentorform.module.scss'
import Image from 'next/image';
import MentorButton from '@/components/button/MentorButton';

export default function MentorForm() {
  const [isApplyDisabled, setIsApplyDisabled] = useState(false);
  const [isReapplyDisabled, setIsReapplyDisabled] = useState(false);
  const [checkedTechs, setCheckedTechs] = useState(Array(16).fill(false));
  const [introduction, setIntroduction] = useState('');

  const handleApplyClick = () => {
    setIsApplyDisabled(true);
  };

  const handleReapplyClick = () => {
    setIsReapplyDisabled(true);
  };

  const handleTechToggle = (index: number): void => {
    setCheckedTechs(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
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
        <input
          type="text"
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          placeholder="한줄 소개를 입력해주세요."
          className={styles.imageGuide}
        />
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
          {Array(16).fill('Text').map((text, index: number) => (
            <label key={index} className={`${styles.tag} ${checkedTechs[index] ? styles.checkedTag : ''}`}>
              <input
                type="checkbox"
                className={styles.hiddenCheckbox}
                checked={checkedTechs[index]}
                onChange={() => handleTechToggle(index)}
              />
              {text}
            </label>
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