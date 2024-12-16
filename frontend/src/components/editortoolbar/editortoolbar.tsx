'use client';
import React from 'react';
import styles from '@/styles/components/editortoolbar/editortoolbar.module.scss';
import Image from 'next/image';

interface EditorToolbarProps {
  onContentChange: (newContent: string) => void;
  content: string;
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
    { icon: '/icon/textline.svg', alt: 'Strike Through' },  // alt 텍스트 변경
  ];

  const utilTools: ToolbarItem[] = [
    { icon: '/icon/link.svg', alt: 'Link' },
    { icon: '/icon/basicimage01.svg', alt: 'Image' },
    { icon: '/icon/syntax.svg', alt: 'Syntax' },
  ];

  const handleHeadingClick = (level: number) => {
    onContentChange(content + `\n${'#'.repeat(level)} `);
  };

  const handleBoldClick = () => {
    onContentChange(content + '**강조할 텍스트**');
  };

  const handleLineClick = () => {
    onContentChange(content + '~~취소선 텍스트~~');  // 취소선 문법으로 변경
  };

  const handleLinkClick = () => {
    onContentChange(content + '[링크텍스트](URL)');
  };

  const handleImageClick = () => {
    onContentChange(content + '![이미지설명](이미지URL)');
  };

  const handleSyntaxClick = () => {
    onContentChange(content + '\n```\n코드를 입력하세요\n```');
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