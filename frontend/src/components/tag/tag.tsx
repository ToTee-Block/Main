'use client';

import React from 'react';
import styles from '@/styles/components/tag/tag.module.scss';

interface TagProps {
  tags: string[];
  selectedTags: boolean[];
  onTagToggle: (index: number) => void;
}

export default function Tag({ tags, selectedTags, onTagToggle }: TagProps) {
  return (
    <div className={styles.tagList}>
      {tags.map((tag, index) => (
        <label
          key={index}
          className={`${styles.tag} ${selectedTags[index] ? styles.checkedTag : ''}`}
        >
          <input
            type="checkbox"
            className={styles.hiddenCheckbox}
            checked={selectedTags[index]}
            onChange={() => onTagToggle(index)}
          />
          {tag}
        </label>
      ))}
    </div>
  );
}