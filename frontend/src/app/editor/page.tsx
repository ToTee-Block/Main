'use client';

import React, { useState } from 'react';
import styles from '@/styles/pages/editer/editer.module.scss';
import Tag from '@/components/tag/tag';
import EditorToolbar from '@/components/editertoolbar/editortoolbar';
import FileUpload from '@/components/editertoolbar/fileupload';
import ActionButtons from '@/components/button/EditorActionButtom/ActionButton';

export default function EditorPage() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>(['java', 'html', 'css', 'javascript', 'JAVA', 'Spring Boot', 'React', 'Next.js','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript']);
  const [selectedTags, setSelectedTags] = useState<boolean[]>(new Array(tags.length).fill(false));

  const handleTagToggle = (index: number) => {
    const newSelectedTags = [...selectedTags];
    newSelectedTags[index] = !newSelectedTags[index];
    setSelectedTags(newSelectedTags);
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorSection}>
        <div className={styles.editorContent}>
          <input
            type="text"
            className={styles.titleInput}
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className={styles.divider} />
          
          <div className={styles.tagSection}>
            <Tag 
              tags={tags} 
              selectedTags={selectedTags} 
              onTagToggle={handleTagToggle} 
            />
          </div>
          
          <FileUpload />
          <EditorToolbar />
          
          <textarea
            className={styles.editorTextarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 작성해주세요."
          />
        </div>
        
        <div className={styles.actionButtons}>
          <ActionButtons />
        </div>
      </div>
      
      <div className={styles.previewSection}>
        {/* Preview content */}
      </div>
    </div>
  );
}