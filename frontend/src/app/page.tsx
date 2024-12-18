import classNames from 'classnames';
import styles from "@/styles/pages/home.module.scss";
import LinkCard from '@/components/card/LinkCard';
import PostCard from '@/components/card/PostCard';
import Tabs from '@/components/Tabs';

const posts = [];
const basePost = {
  href: "/#",
  title: "Post",
  description: "예시 텍스트 입니다.",
  user: "admin",
  date: "2024.11.20",
  imageUrl: "/images/Rectangle.png"
};

// 5개의 원본 포스트 항목을 16개로 확장
for (let i = 0; i < 8; i++) {
  const post = { ...basePost, user: `admin0${i + 7}` }; // admin07, admin08, ...
  posts.push(post);
}

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
        <div className={styles.content_container}>
        <div className={styles.container}>
          <p>Post</p>
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
        </div>
      </main>
    </>
  );
}
