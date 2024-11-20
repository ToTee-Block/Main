import React from 'react';
import Link from 'next/link'; // Next.js에서 제공하는 Link 컴포넌트 임포트
import styles from '@/styles/components/button/link-button.module.scss'; // SCSS 모듈 임포트

// LinkButton Props 타입 정의
interface LinkButtonProps {
  to: string; // 이동할 경로 (필수)
  children: React.ReactNode; // 버튼 내용 (필수)
}

const LinkButton: React.FC<LinkButtonProps> = ({ to, children}) => {
  return (
    <Link href={to} className={styles.linkButton}>
        {children}
    </Link>
  );
};

export default LinkButton;
