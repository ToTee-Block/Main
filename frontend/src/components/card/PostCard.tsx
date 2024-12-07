import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/components/card/post-card.module.scss';

interface PostCardProps {
  href: string;
  title: string;
  description: string;
  user: string;
  date: string;
  imageUrl: string;
}

const PostCard: React.FC<PostCardProps> = ({ href, title, description, user, date, imageUrl }) => {
  return (
    <Link href={href}>
      <div className={styles.PostCard}>
        <div className={styles.imageWrapper}>
          <Image src={imageUrl} alt={title} width={100} height={100} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          <div className={styles.textBox}>
            <span className={styles.user}>{user}</span>
            <span className={styles.date}>{date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};


export default PostCard;
