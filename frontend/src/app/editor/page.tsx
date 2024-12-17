'use client';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '@/styles/pages/editor/editor.module.scss';
import Tag from '@/components/tag/tag';
import EditorToolbar from '@/components/editortoolbar/editortoolbar';
import FileUpload from '@/components/editortoolbar/fileupload';
import ActionButtons from '@/components/button/EditorActionButtom/ActionButton';

export default function EditorPage() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>(['java', 'html', 'css', 'javascript', 'JAVA', 'Spring Boot', 'React', 'Next.js','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript']);
  const [selectedTags, setSelectedTags] = useState<boolean[]>(
    new Array(tags.length).fill(false)
  );

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
            placeholder="제목을 작성해주세요"
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
          <EditorToolbar 
            onContentChange={setContent}
            content={content}
          />

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
                h1: ({node, ...props}) => (
                  <h1 {...props} className={styles.markdownH1} />
                ),
                h2: ({node, ...props}) => (
                  <h2 {...props} className={styles.markdownH2} />
                ),
                h3: ({node, ...props}) => (
                  <h3 {...props} className={styles.markdownH3} />
                ),
                h4: ({node, ...props}) => (
                  <h4 {...props} className={styles.markdownH4} />
                ),
                a: ({node, ...props}) => (
                  <a {...props} className={styles.markdownLink} />
                ),
                del: ({node, ...props}) => (
                  <del {...props} className={styles.markdownStrike} />
                ),
                strong: ({node, ...props}) => (
                  <strong {...props} className={styles.markdownBold} />
                )
              }}
            >
              {content || ''}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}