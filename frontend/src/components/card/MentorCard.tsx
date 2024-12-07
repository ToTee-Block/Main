import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import styles from '@/styles/components/card/mentor-card.module.scss';

interface MentorCardProps {
  href: string;
  name: string;
  type: string;
  description: string;
  // imageUrl: string;
}

const MentorCard: React.FC<MentorCardProps> = ({ href, name, type, description }) => {
  return (
    <Link href={href}>
      <div className={styles.MentorCard}>
        <div className={styles.imageWrapper}>
          {/* <Image src={imageUrl} alt={name} width={100} height={100} /> */}
        </div>
        <div className={styles.content}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.type}>{type}</p>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default MentorCard;