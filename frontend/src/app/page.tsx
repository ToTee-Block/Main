'use client';
import classNames from 'classnames';
import styles from "@/styles/pages/home.module.scss";
import LinkCard from '@/components/card/LinkCard';
import PostCard from '@/components/card/PostCard';
import Link from 'next/link';
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

for (let i = 0; i < 8; i++) {
  const post = { ...basePost, user: `admin0${i + 7}` };
  posts.push(post);
}

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        {/* 기존 상단 부분 유지 */}
        <div className={classNames(styles.container, styles.background_container)}>
          <div className={styles.banner_card}></div>
          <div className={styles.link_cardBox}>
            <LinkCard
              href="/about"
              title="ToTee"
              description="Block ?"
              imageUrl="/icon/card01.svg"
            />
            <LinkCard
              href="/mentor"
              title="Mentor"
              description="신청하기"
              imageUrl="/icon/card02.svg"
            />
            <LinkCard
              href="/qna"
              title="개발"
              description="질문답변"
              imageUrl="/icon/card03.svg"
            />
          </div>
        </div>

        {/* 포스트와 멘토 섹션 수정 */}
        <div className={styles.content_container}>
          {/* 포스트 섹션 */}
          <div className={styles.section_container}>
            <p>Post</p>
            <div className={styles.containerItemBox}>
              {posts.map((post, index) => (
                <PostCard
                  key={index}
                  href={post.href}
                  title={post.title}
                  description={post.description}
                  user={post.user}
                  date={post.date}
                  imageUrl={post.imageUrl}
                />
              ))}
            </div>
            <Link href="/post" className={styles.moreButton}>
              <span>Post 더보기</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 6L15 12L9 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          {/* 멘토 섹션 */}
          <div className={styles.section_container}>
            <p>Mentor</p>
            <Tabs />
            <Link href="/mentor" className={styles.moreButton}>
              <span>Mentor 더보기</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 6L15 12L9 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}