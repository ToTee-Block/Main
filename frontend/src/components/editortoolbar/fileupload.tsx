'use client';

import  { useRef } from 'react';
import styles from '@/styles/components/editortoolbar/fileupload.module.scss';
import Image from 'next/image';

interface FileInputChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: EventTarget & HTMLInputElement;
  }
  
  export default function FileUpload() {
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const handleClick = () => {
      fileInputRef.current?.click();
    };
  
    const handleFileChange = (e: FileInputChangeEvent) => {
      // 파일 처리 로직
      if (e.target.files) {
        console.log(e.target.files);
      }
    };
  
    return (
      <div className={styles.uploadWrapper} onClick={handleClick}>
        <div className={styles.uploadContent}>
          <div className={styles.uploadIcon}>
            <Image 
              src="/icon/upload.svg" 
              alt="Upload" 
              width={24} 
              height={24}
              className={styles.icon}
            />
          </div>
          <span className={styles.browseFiles}>
            Browse files
          </span>
          <input 
            type="file" 
            ref={fileInputRef}
            className={styles.hiddenInput}
            onChange={handleFileChange}
          />
        </div>
      </div>
    );
  }