'use client';
import React, { useState } from 'react';
import styles from '@/styles/pages/editor/editor.module.scss';
import Tag from '@/components/tag/tag';
import EditorToolbar from '@/components/editortoolbar/editortoolbar';
import FileUpload from '@/components/editortoolbar/fileupload';
import ActionButtons from '@/components/button/EditorActionButtom/ActionButton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function EditorPage() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [images, setImages] = useState<{ [key: string]: string }>({});
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
        // 이미지 URL 생성
        const imageUrl = URL.createObjectURL(file);
        // 고유한 키 생성 (랜덤 문자열 사용)
        const imageKey = `image-${Math.random().toString(36).substring(2, 15)}`;
        
        // 이미지 URL을 상태에 저장
        setImages(prev => ({
          ...prev,
          [imageKey]: imageUrl
        }));
        
        const textarea = e.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        // 이미지 마크다운 구문 생성 (파일 이름 제외)
        const imageMarkdown = `![](${imageKey})\n`;
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

  // URL.createObjectURL로 생성된 URL 해제
  React.useEffect(() => {
    return () => {
      Object.values(images).forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

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
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className={styles.markdownH1} {...props} />,
                h2: ({node, ...props}) => <h2 className={styles.markdownH2} {...props} />,
                h3: ({node, ...props}) => <h3 className={styles.markdownH3} {...props} />,
                h4: ({node, ...props}) => <h4 className={styles.markdownH4} {...props} />,
                a: ({node, ...props}) => <a className={styles.markdownLink} {...props} />,
                del: ({node, ...props}) => <del className={styles.markdownStrike} {...props} />,
                img: ({node, src, ...props}) => {
                  const actualSrc = images[src] || src;
                  return actualSrc ? (
                    <img 
                      className={styles.markdownImage} 
                      src={actualSrc}
                      {...props}
                    />
                  ) : null;
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}