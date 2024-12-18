'use client';

import React from 'react';
import styles from '@/styles/components/button/editor/editoraction-button.module.scss';
import Image from 'next/image';

export default function ActionButtons() {
  return (
    <div className={styles.actionButtonsContainer}>
      <button className={styles.exitButton}>
        <Image 
          src="icon/arrow.svg" 
          alt="뒤로가기 화살표" 
          width={12}
          height={12}
        />
        나가기
      </button>
      <div className={styles.rightButtons}>
        <button className={styles.draftButton}>
          임시저장
        </button>
        <button className={styles.submitButton}>
          작성완료
        </button>
      </div>
    </div>
  );
}