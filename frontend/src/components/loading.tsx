'use client';

import styles from "@/styles/components/loading.module.scss";

export default function Loading() {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>
          <div className={styles.box}>
            <span style={{'--x': '0px', '--y': '-50px'} as React.CSSProperties}></span>
            <span style={{'--x': '30px', '--y': '-30px'} as React.CSSProperties}></span>
            <span style={{'--x': '-30px', '--y': '-30px'} as React.CSSProperties}></span>
          </div>
          <div className={styles.typingDemo}>
            Loading...
          </div>
        </div>
      </div>
    );
  }
