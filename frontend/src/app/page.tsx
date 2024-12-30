"use client";

import { useState, useEffect } from "react";
import classNames from "classnames";
import styles from "@/styles/pages/home.module.scss";
import LinkCard from "@/components/card/LinkCard";
import PostCard from "@/components/card/PostCard";
import Link from "next/link";
import Tabs from "@/components/Tabs";
import axios from "axios";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/v1/posts", {
          params: { page: 0, size: 10, kw: "" },
        });

        const resultCode = response.data.resultCode;
        const data = response.data.data;
        console.log(response);
        if (resultCode === "200") {
          console.log(data[0].content);
          setPosts(data[0].content);
        }
      } catch (error) {
        console.log("error: " + error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <main className={styles.main}>
        {/* 기존 상단 부분 유지 */}
        <div
          className={classNames(styles.container, styles.background_container)}
        >
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
                  href={`/post/detail?id=${post.id}`}
                  title={post.subject}
                  description={post.content}
                  user={post.authorName}
                  date={post.createdDate}
                  imageUrl={
                    post.thumbnail
                      ? `/uploaded/${post.thumbnail}`
                      : "/images/Rectangle.png"
                  }
                />
              ))}
            </div>
            <div className={styles.moreButtonContainer}>
              <Link href="/post" className={styles.moreButton}>
                <span>Post</span>
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 8L14 12L10 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* 멘토 섹션 */}
          <div className={styles.section_container}>
            <p>Mentor</p>
            <Tabs />
            <div className={styles.moreButtonContainer}>
              <Link href="/mentor" className={styles.moreButton}>
                <span>Mentor</span>
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 8L14 12L10 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
