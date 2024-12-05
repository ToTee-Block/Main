import React from 'react';
import Link from 'next/link';
import styles from '@/styles/components/button/text-link-button.module.scss';

// TextLinkButton Props 타입 정의
interface TextLinkButtonProps {
  to: string;
  children: React.ReactNode;
}

const TextLinkButton: React.FC<TextLinkButtonProps> = ({ to, children }) => {
  return (
    <Link href={to} className={styles.textLinkButton}>
      {children}
    </Link>
  );
};

export default TextLinkButton;
