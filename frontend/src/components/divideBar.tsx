import React from 'react';
import styles from '@/styles/components/divide-bar.module.scss'; // SCSS 모듈 임포트

interface DivideBarProps {
  width: number;
}

const DivideBar: React.FC<DivideBarProps> = ({ width }) => {
  return (
    <div style={{width}} className={styles.divideBar}>
    </div>
  );
};

export default DivideBar;
