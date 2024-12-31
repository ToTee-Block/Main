import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/components/card/post-card.module.scss";
import MarkdownWithHtml from "../MarkdownWithHtml";

interface PostCardProps {
  href: string;
  title: string;
  description: string;
  user: string;
  date: string;
  imageUrl: string;
}

const PostCard: React.FC<PostCardProps> = ({
  href,
  title,
  description,
  user,
  date,
  imageUrl,
}) => {
  const removeImgAndAnchorTags = (content: string) => {
    // 이미지 제거
    let result = content.replace(/<img[^>]*>/g, "");
    result = result.replace(/!\[([^\]]*)\]\([^\)]+\)/g, "");
    // 링크 제거
    result = result.replace(/<a[^>]*>(.*?)<\/a>/g, "$1");
    result = result.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");

    return result;
  };

  return (
    <Link href={href}>
      <div className={styles.PostCard}>
        <div className={styles.imageWrapper}>
          <Image src={imageUrl} alt={title} width={100} height={100} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.description}>
            <MarkdownWithHtml
              markdownContent={removeImgAndAnchorTags(description)}
            />
          </div>
          <div className={styles.textBox}>
            <span className={styles.user}>{user}</span>
            <span className={styles.date}>
              {new Date(date).toISOString().split("T")[0]}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
