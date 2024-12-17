'use client';
import React, { useState } from 'react';
import styles from '@/styles/pages/editor/editor.module.scss';
import Tag from '@/components/tag/tag';
import EditorToolbar from '@/components/editortoolbar/editortoolbar';
import FileUpload from '@/components/editortoolbar/fileupload';
import ActionButtons from '@/components/button/EditorActionButtom/ActionButton';

export default function EditorPage() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>([
    'java', 'html', 'css', 'javascript', 'JAVA', 'Spring Boot', 'React', 'Next.js',
    'javascript','javascript','javascript','javascript','javascript','javascript',
    'javascript','javascript','javascript','javascript','javascript','javascript',
    'javascript','javascript','javascript','javascript'
  ]);
  const [selectedTags, setSelectedTags] = useState<boolean[]>(
    new Array(tags.length).fill(false)
  );

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (files.length === 0) return;

    try {
      for (const file of files) {
        // 실제 구현 시에는 서버 업로드 로직으로 변경
        const imageUrl = URL.createObjectURL(file);
        
        // 커서 위치에 이미지 마크다운 삽입
        const textarea = e.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        const imageMarkdown = `![${file.name}](${imageUrl})\n`;
        const newContent = 
          content.substring(0, start) + 
          imageMarkdown + 
          content.substring(end);
        
        setContent(newContent);
      }
    } catch (error) {
      console.error('이미지 처리 중 오류 발생:', error);
    }
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorSection}>
        <div className={styles.editorContent}>
          <input
            type="text"
            className={styles.titleInput}
            placeholder="제목을 작성해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <div className={styles.divider} />
          
          <div className={styles.tagSection}>
            <Tag
              tags={tags}
              selectedTags={selectedTags}
              onTagToggle={(index) => {
                const newSelectedTags = [...selectedTags];
                newSelectedTags[index] = !newSelectedTags[index];
                setSelectedTags(newSelectedTags);
              }}
            />
          </div>

          <FileUpload />
          
          <EditorToolbar
            onContentChange={setContent}
            content={content}
          />

          <textarea
            className={styles.editorTextarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            placeholder="내용을 작성해주세요."
          />
        </div>

        <div className={styles.actionButtons}>
          <ActionButtons />
        </div>
      </div>

      <div className={styles.previewSection}>
        <div className={styles.previewContent}>
          <input
            type="text"
            className={styles.previewTitle}
            value={title || ''}
            readOnly
          />
          <div className={styles.divider} />
          <div className={styles.markdownContent}>
            {/* 이미지를 포함한 마크다운 렌더링 */}
            {content.split('\n').map((line, index) => {
              const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
              if (imgMatch) {
                return (
                  <img
                    key={index}
                    src={imgMatch[2]}
                    alt={imgMatch[1]}
                    className={styles.markdownImage}
                  />
                );
              }
              return <p key={index}>{line}</p>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}