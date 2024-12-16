'use client';

import React from 'react';
import styles from '@/styles/components/editortoolbar/editertoolbar.module.scss';
import Image from 'next/image';

interface ToolbarItem {
  icon: string;
  alt: string;
}

export default function EditorToolbar() {
  const headingTools: ToolbarItem[] = [
    { icon: '/icon/H1.svg', alt: 'Heading 1' },
    { icon: '/icon/H2.svg', alt: 'Heading 2' },
    { icon: '/icon/H3.svg', alt: 'Heading 3' },
    { icon: '/icon/H4.svg', alt: 'Heading 4' },
  ];

  const textTools: ToolbarItem[] = [
    { icon: '/icon/bold.svg', alt: 'Bold' },
    { icon: '/icon/textline.svg', alt: 'Text line' },
  ];

  const utilTools: ToolbarItem[] = [
    { icon: '/icon/link.svg', alt: 'Link' },
    { icon: '/icon/basicimage01.svg', alt: 'Image' },
    { icon: '/icon/syntax.svg', alt: 'Syntax' },
  ];

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolGroup}>
        {headingTools.map((tool, index) => (
          <button key={index} className={styles.toolButton}>
            <Image src={tool.icon} alt={tool.alt} width={48} height={48} />
          </button>
        ))}
      </div>
      <div className={styles.toolGroup}>
        {textTools.map((tool, index) => (
          <button key={index} className={styles.toolButton}>
            <Image src={tool.icon} alt={tool.alt} width={48} height={48} />
          </button>
        ))}
      </div>
      <div className={styles.toolGroup}>
        {utilTools.map((tool, index) => (
          <button key={index} className={styles.toolButton}>
            <Image src={tool.icon} alt={tool.alt} width={48} height={48} />
          </button>
        ))}
      </div>
    </div>
  );
}