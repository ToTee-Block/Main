import classNames from 'classnames';
import styles from "@/styles/pages/home.module.scss";
import LinkCard from '@/components/card/LinkCard';
import PostCard from '@/components/card/PostCard';
import Tabs from '@/components/Tabs';

const posts = [
  {
    href: "/#",
    title: "Post",
    description: "예시 텍스트 입니다.",
    user: "admin07",
    date: "2024.11.20",
    imageUrl: "/images/Rectangle.png"
  },
  {
    href: "/#",
    title: "Post",
    description: "예시 텍스트 입니다.",
    user: "admin08",
    date: "2024.11.20",
    imageUrl: "/images/Rectangle.png"
  },
  {
    href: "/#",
    title: "Post",
    description: "예시 텍스트 입니다.",
    user: "admin09",
    date: "2024.11.20",
    imageUrl: "/images/Rectangle.png"
  },
  {
    href: "/#",
    title: "Post",
    description: "예시 텍스트 입니다.",
    user: "admin09",
    date: "2024.11.20",
    imageUrl: "/images/Rectangle.png"
  },
  {
    href: "/#",
    title: "Post",
    description: "예시 텍스트 입니다.",
    user: "admin09",
    date: "2024.11.20",
    imageUrl: "/images/Rectangle.png"
  }
];

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <div className={classNames(styles.container, styles.background_container)}>
          <div className={styles.banner_card}></div>
          <div className={styles.link_cardBox}>
            <LinkCard href="/about"
              title="ToTee"
              description="Block ?"
              imageUrl="/icon/card01.svg"></LinkCard>

            <LinkCard href="/mentor"
              title="Mentor"
              description="신청하기"
              imageUrl="/icon/card02.svg"></LinkCard>

            <LinkCard href="/qna"
              title="개발"
              description="질문답변"
              imageUrl="/icon/card03.svg"></LinkCard>
          </div>
        </div>
        <div className={styles.container}>
          <p>Post</p>
          <div className={classNames(styles.containerItemBox, styles.containerItemBox_mb)}>
            {posts.map((post, index) => (
              <PostCard
                key={index} // 각 카드에 고유한 key 값을 지정
                href={post.href}
                title={post.title}
                description={post.description}
                user={post.user}
                date={post.date}
                imageUrl={post.imageUrl}
              />
            ))}
          </div>
          
          <div className={styles.containerItemBox}>
            {posts.map((post, index) => (
              <PostCard
                key={index} // 각 카드에 고유한 key 값을 지정
                href={post.href}
                title={post.title}
                description={post.description}
                user={post.user}
                date={post.date}
                imageUrl={post.imageUrl}
              />
            ))}
          </div>
        </div>
        <div className={styles.container}>
          <p>Mentor</p>
          <div className={styles.containerItemBox}>
            <Tabs></Tabs>
          </div>
        </div>
      </main>
    </>
  );
}
