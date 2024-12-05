import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/components/card/link-card.module.scss';

interface LinkCardProps {
  href: string;
  title: string;
  description: string;
  imageUrl: string;
}

const LinkCard: React.FC<LinkCardProps> = ({ href, title, description, imageUrl }) => {
  return (
    <Link href={href}>
      <div className={styles.LinkCard}>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.imageWrapper}>
          <Image src={imageUrl} alt={title} width={100} height={100} />
        </div>
      </div>
    </Link>
  );
};


export default LinkCard;
