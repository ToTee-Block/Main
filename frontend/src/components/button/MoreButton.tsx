'use client';
import Link from 'next/link';
import styles from '@/styles/components/button/more-button.module.scss';

interface MoreButtonProps {
  href: string;
}

export default function MoreButton({ href }: MoreButtonProps) {
  return (
    <Link href={href} className={styles.moreButton}>
      <span>더보기</span>
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M6 12L10 8L6 4" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}