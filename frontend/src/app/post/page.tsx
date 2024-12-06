"use client";

import classNames from 'classnames';
import React, { useState } from "react";
import styles from '@/styles/pages/post/list.module.scss';
import SearchBox from '@/components/search/SearchBox';
import LinkButton from '@/components/button/LinkButton';
import PostCard from '@/components/card/PostCard';

const Post: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("recent");

  const basePost = {
    href: "/#",
    title: "Post",
    description: "예시 텍스트 입니다.",
    user: "admin01",
    date: "2024.11.20",
    imageUrl: "/images/Rectangle.png"
  };

  const posts: Record<string, { href: string; title: string; description: string; user: string; date: string; imageUrl: string; }[]> = {
    recent: Array.from({ length: 10 }, (_, index) => ({
      ...basePost,
      href: "/content-recent",
      user: `recent ${index+1}`,
      title: "recent",
  })),
    hot: Array.from({ length: 10 }, (_, index) => ({
      ...basePost,
      href: "/content-hot",
      user: `hot ${index+1}`,
      title: "hot",
    })),
    feed: Array.from({ length: 10 }, (_, index) => ({
      ...basePost,
      href: "/content-feed",
      user: `feed ${index+1}`,
      title: "feed",
    })),
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Totee Post</h1>
          <div className={styles.utilBar}>
            <ul className={styles.tabBox}>
              <li 
                className={`${activeTab === "recent" ? styles.active : ""}`}
                onClick={() => setActiveTab("recent")}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13 2C13 1.44772 12.5523 1 12 1C11.4477 1 11 1.44772 11 2V6C11 6.55228 11.4477 7 12 7C12.5523 7 13 6.55228 13 6V2Z" fill="currentColor"/>
  <path d="M13 18C13 17.4477 12.5523 17 12 17C11.4477 17 11 17.4477 11 18V22C11 22.5523 11.4477 23 12 23C12.5523 23 13 22.5523 13 22V18Z" fill="currentColor"/>
  <path d="M4.22282 4.22289C4.61335 3.83236 5.24651 3.83236 5.63704 4.22289L8.46704 7.05289C8.85756 7.44341 8.85756 8.07658 8.46704 8.4671C8.07651 8.85762 7.44335 8.85762 7.05282 8.4671L4.22282 5.6371C3.8323 5.24658 3.8323 4.61341 4.22282 4.22289Z" fill="currentColor"/>
  <path d="M16.9471 15.5329C16.5566 15.1424 15.9234 15.1424 15.5329 15.5329C15.1424 15.9234 15.1424 16.5566 15.5329 16.9471L18.3629 19.7771C18.7534 20.1676 19.3866 20.1676 19.7771 19.7771C20.1676 19.3866 20.1676 18.7534 19.7771 18.3629L16.9471 15.5329Z" fill="currentColor"/>
  <path d="M1 12C1 11.4477 1.44772 11 2 11H6C6.55228 11 7 11.4477 7 12C7 12.5523 6.55228 13 6 13H2C1.44772 13 1 12.5523 1 12Z" fill="currentColor"/>
  <path d="M18 11C17.4477 11 17 11.4477 17 12C17 12.5523 17.4477 13 18 13H22C22.5523 13 23 12.5523 23 12C23 11.4477 22.5523 11 22 11H18Z" fill="currentColor"/>
  <path d="M8.46704 15.5329C8.85756 15.9234 8.85756 16.5566 8.46704 16.9471L5.63704 19.7771C5.24651 20.1676 4.61335 20.1676 4.22282 19.7771C3.8323 19.3866 3.8323 18.7534 4.22283 18.3629L7.05282 15.5329C7.44335 15.1424 8.07651 15.1424 8.46704 15.5329Z" fill="currentColor"/>
  <path d="M19.7771 5.6371C20.1676 5.24657 20.1676 4.61341 19.7771 4.22289C19.3866 3.83236 18.7534 3.83236 18.3629 4.22289L15.5329 7.05289C15.1424 7.44341 15.1424 8.07658 15.5329 8.4671C15.9234 8.85762 16.5566 8.85762 16.9471 8.4671L19.7771 5.6371Z" fill="currentColor"/>
                </svg>
                <span>최신글</span>
              </li>
              <li 
                className={`${activeTab === "hot" ? styles.active : ""}`}
                onClick={() => setActiveTab("hot")}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M10.5128 5.36261C8.6934 3.54319 5.74355 3.54319 3.92413 5.36261C2.10472 7.18202 2.10472 10.1319 3.92413 11.9513L4.70384 12.731C4.71658 12.7437 4.72895 12.7568 4.74093 12.7701L11.9996 20.0289L19.258 12.7705C19.2701 12.7571 19.2825 12.7439 19.2954 12.731L20.0751 11.9513C21.8945 10.1319 21.8945 7.18202 20.0751 5.36261C18.2557 3.54319 15.3059 3.54319 13.4864 5.36261L12.7067 6.14232C12.3162 6.53284 11.683 6.53284 11.2925 6.14232L10.5128 5.36261ZM20.7481 14.1068C20.736 14.1202 20.7236 14.1333 20.7107 14.1462L12.7078 22.1491C12.5202 22.3367 12.2657 22.4421 12.0004 22.442C12.0002 22.442 12.0007 22.442 12.0004 22.442C12.0002 22.442 11.9991 22.442 11.9988 22.442C11.7335 22.4421 11.4791 22.3367 11.2915 22.1491L3.2886 14.1462C3.2757 14.1333 3.26323 14.1202 3.25118 14.1068L2.50992 13.3655C-0.0905439 10.765 -0.0905477 6.54886 2.50992 3.9484C5.11038 1.34793 9.32657 1.34793 11.927 3.9484L11.9996 4.021L12.0722 3.9484C14.6727 1.34793 18.8889 1.34793 21.4893 3.9484C24.0898 6.54886 24.0898 10.765 21.4893 13.3655L20.7481 14.1068Z" fill="currentColor"/>
                </svg>
                <span>인기글</span>
              </li>
              <li 
                className={`${activeTab === "feed" ? styles.active : ""}`}
                onClick={() => setActiveTab("feed")}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M11 1C10.6048 1 10.2467 1.23273 10.0862 1.59386L6.35013 10H4C3.20435 10 2.44129 10.3161 1.87868 10.8787C1.31607 11.4413 1 12.2044 1 13V20C1 20.7957 1.31607 21.5587 1.87868 22.1213C2.44129 22.6839 3.20435 23 4 23H18.2748C18.9961 23.0067 19.6958 22.7532 20.2456 22.2859C20.7966 21.8175 21.1599 21.1658 21.2686 20.4507L22.6487 11.4501C22.7139 11.0201 22.6849 10.5811 22.5637 10.1634C22.4424 9.7458 22.2318 9.3595 21.9465 9.03134C21.6611 8.70317 21.3078 8.44096 20.911 8.26289C20.5162 8.08567 20.0876 7.996 19.6549 8H15V5C15 3.93913 14.5786 2.92172 13.8284 2.17157C13.0783 1.42143 12.0609 1 11 1ZM11.6078 3.0946L8 11.2122V21H18.2913C18.5325 21.0027 18.7665 20.9183 18.9503 20.7621C19.134 20.6059 19.2551 20.3885 19.2913 20.1501L20.6713 11.1499C20.693 11.0067 20.6834 10.8601 20.643 10.7211C20.6026 10.5818 20.5324 10.4531 20.4373 10.3437C20.3421 10.2343 20.2244 10.1469 20.0921 10.0875C19.9599 10.0282 19.8163 9.99829 19.6713 9.99994L19.66 10.0001L14 10C13.4477 10 13 9.55228 13 9V5C13 4.46957 12.7893 3.96086 12.4142 3.58579C12.1864 3.35794 11.9092 3.19075 11.6078 3.0946ZM6 12V21H4C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V13C3 12.7348 3.10536 12.4804 3.29289 12.2929C3.48043 12.1054 3.73478 12 4 12H6Z" fill="currentColor"/>
                </svg>
                <span>피드</span>
              </li>
            </ul>
            <div className={styles.rightBox}>
              <LinkButton to="">My Post</LinkButton>
              <SearchBox></SearchBox>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.container}>
          <div className={styles.containerItemBox}>
            {posts[activeTab].map((post, index) => (
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
    </>
  );
}

export default Post;