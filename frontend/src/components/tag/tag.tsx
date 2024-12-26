"use client";

import React from "react";
import styles from "@/styles/components/tag/tag.module.scss";

interface TagProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void | null;
}

export default function Tag({ tags, selectedTags, onTagToggle }: TagProps) {
  return (
    <div className={styles.tagList}>
      {tags.map((tag, index) => (
        <label
          key={index}
          className={`${styles.tag} ${
            selectedTags.includes(tag) ? styles.checkedTag : ""
          }`}
          style={{ cursor: onTagToggle == null ? "auto" : "pointer" }}
        >
          <input
            type="checkbox"
            className={styles.hiddenCheckbox}
            checked={selectedTags.includes(tag)}
            onChange={() => {
              onTagToggle == null ? {} : onTagToggle(tag);
            }}
          />
          {tag}
        </label>
      ))}
    </div>
  );
}
