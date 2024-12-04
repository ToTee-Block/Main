'use client'; 

import React from 'react';
import styles from '@/styles/components/footer.module.scss';
import Link from 'next/link';

const Footer: React.FC = () => {

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <span className={styles.logo}>ToTee Block</span>
        <nav className={styles.nav}>
          <Link href="/privacy">
          <span>Privacy Policy</span>
          </Link>
          <Link href="/terms">
          <span>Terms & Conditions</span>
          </Link>
          <Link href="/cookie">
          <span>Cookie Policy</span>
          </Link>
          <Link href="/contact">
          <span>Contact</span>
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
