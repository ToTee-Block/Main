'use client'; 

import React from 'react';
import styles from '@/styles/components/footer.module.scss';
import Link from 'next/link';

const Footer: React.FC = () => {

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <span className={styles.logo}>Totee Block</span>
        <nav className={styles.nav}>
          <Link href="/개인정보처리방침">
          <span>Privacy Policy</span>
          </Link>
          <Link href="/이용약관">
          <span>Terms & Conditions</span>
          </Link>
          <Link href="/쿠키정책">
          <span>Cookie Policy</span>
          </Link>
          <Link href="/연락처">
          <span>Contact</span>
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
