'use client';
import classNames from 'classnames';
import styles from "@/styles/pages/home.module.scss";
import LinkCard from '@/components/card/LinkCard';
import PostCard from '@/components/card/PostCard';
import Tabs from '@/components/Tabs';
import Link from 'next/link';

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

const mentors = [
  {
    name: "John Doe",
    company: "ABC Company",
    position: "Senior Developer",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    imageUrl: "/path/to/mentor/image1.jpg"
  },
  {
    name: "Jane Smith",
    company: "XYZ Corporation",
    position: "Software Architect",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    imageUrl: "/path/to/mentor/image2.jpg"
  },
];

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
            <Link href="/posts" className={styles.moreButton}>
              <span>Post</span>
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

          <div className={styles.section_container}>
            <p>Mentor</p>
            <div className={styles.mentorGrid}>
              {Array(10).fill(null).map((_, index) => (
                <Link href="/mentor/detail" key={index} className={styles.mentorCard}>
                  <div className={styles.profileImage} />
                  <div className={styles.mentorInfo}>
                    <div className={styles.nameWrapper}>
                      <span className={styles.nameText}>박승수</span>
                      <span className={styles.mentorText}>멘토</span>
                    </div>
                    <div className={styles.infoWrapper}>
                      <span className={styles.company}>Google</span>
                      <span className={styles.position}>Full-Stack</span>
                    </div>
                    <div className={styles.descriptionWrapper}>
                      <span className={styles.description}>구글의 모든 서비스를 총괄</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/mentor" className={styles.moreButton}>
              <span>Mentor</span>
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