'use client';
import React from 'react';
import styles from '@/styles/components/editortoolbar/editortoolbar.module.scss';
import Image from 'next/image';

interface EditorToolbarProps {
  onContentChange: (newContent: string) => void;
  content: string;
  onSelect?: (range: { start: number; end: number }) => void;
}

interface ToolbarItem {
  icon: string;
  alt: string;
}

export default function EditorToolbar(props: EditorToolbarProps) {
  const { onContentChange, content } = props;

  const headingTools: ToolbarItem[] = [
    { icon: '/icon/H1.svg', alt: 'Heading 1' },
    { icon: '/icon/H2.svg', alt: 'Heading 2' },
    { icon: '/icon/H3.svg', alt: 'Heading 3' },
    { icon: '/icon/H4.svg', alt: 'Heading 4' },
  ];

  const textTools: ToolbarItem[] = [
    { icon: '/icon/bold.svg', alt: 'Bold' },
    { icon: '/icon/textline.svg', alt: 'Strike Through' },
  ];

  const utilTools: ToolbarItem[] = [
    { icon: '/icon/link.svg', alt: 'Link' },
    { icon: '/icon/basicimage01.svg', alt: 'Image' },
    { icon: '/icon/syntax.svg', alt: 'Syntax' },
  ];

  const getTextAreaInfo = () => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return null;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    return { textarea, start, end, selectedText };
  };

  const insertMarkdown = (prefix: string, suffix: string = '', placeholder: string = '') => {
    const info = getTextAreaInfo();
    if (!info) return;

    const { textarea, start, end, selectedText } = info;
    const newText = `${prefix}${selectedText || placeholder}${suffix}`;
    const newContent = 
      content.substring(0, start) + 
      newText +
      content.substring(end);

    onContentChange(newContent);

    // 커서 위치 조정
    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + prefix.length;
      const selectionLength = selectedText ? selectedText.length : placeholder.length;
      textarea.setSelectionRange(cursorPos, cursorPos + selectionLength);
    }, 0);
  };

  const handleHeadingClick = (level: number) => {
    insertMarkdown('#'.repeat(level) + ' ', '', '제목');
  };

  const handleBoldClick = () => {
    insertMarkdown('**', '**', '강조할 텍스트');
  };

  const handleLineClick = () => {
    insertMarkdown('~~', '~~', '취소선 텍스트');
  };

  const handleLinkClick = () => {
    insertMarkdown('[', ']()', '링크 텍스트');
  };

  const handleImageClick = () => {
    insertMarkdown('![', ']()', '이미지 설명');
  };

  const handleSyntaxClick = () => {
    insertMarkdown('\n```\n', '\n```\n', '코드를 입력하세요');
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolGroup}>
        {headingTools.map((tool, index) => (
          <button 
            key={index}
            className={styles.toolButton}
            onClick={() => handleHeadingClick(index + 1)}
          >
            <Image src={tool.icon} alt={tool.alt} width={48} height={48} />
          </button>
        ))}
      </div>
      <div className={styles.toolGroup}>
        {textTools.map((tool, index) => (
          <button 
            key={index}
            className={styles.toolButton}
            onClick={index === 0 ? handleBoldClick : handleLineClick}
          >
            <Image src={tool.icon} alt={tool.alt} width={48} height={48} />
          </button>
        ))}
      </div>
      <div className={styles.toolGroup}>
        {utilTools.map((tool, index) => (
          <button 
            key={index}
            className={styles.toolButton}
            onClick={
              index === 0 ? handleLinkClick :
              index === 1 ? handleImageClick :
              handleSyntaxClick
            }
          >
            <Image src={tool.icon} alt={tool.alt} width={48} height={48} />
          </button>
        ))}
      </div>
    </div>
  );
}