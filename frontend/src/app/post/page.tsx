"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchUserProfile } from "@/api/axiosConfig";
import styles from "@/styles/pages/post/list.module.scss";
import SearchBox from "@/components/search/SearchBox";
import LinkButton from "@/components/button/LinkButton";
import PostCard from "@/components/card/PostCard";
import NoSearch from "@/components/exception/NoSearch";
import Pagination from "@/components/pagination/custompagination";

const Post: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("recent");
  // 상태 정의
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [recentPosts, setRecentPosts] = useState([]);
  const [hotPosts, setHotPosts] = useState([]);
  const [loginStatus, setLoginStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkLogin = async () => {
    const response = await fetchUserProfile();
    console.log(response);
    if (response.resultCode == "200") {
      setLoginStatus(true);
      return;
    }
    setLoginStatus(false);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const page = Number(queryParams.get("page")) || 0;
    const kw = queryParams.get("kw") || "";

    setCurrentPage(page + 1);
    checkLogin();

    const fetchRecentPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/v1/posts", {
          params: { page, size: 16, kw },
        });
        const data = response.data.data;
        console.log(data);
        setRecentPosts(data[0].content);
        setHotPosts(data[1].content);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch recent posts.");
        setLoading(false);
      }
    };

    fetchRecentPosts(); // 페이지가 로드될 때 데이터 호출
  }, [activeTab]); // 빈 배열을 넣어 컴포넌트가 마운트될 때 한 번만 호출

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // posts 객체 정의
  const posts = {
    recent:
      recentPosts.length > 0
        ? recentPosts.map((post) => ({
            href: `/post/detail?id=${post.id}`,
            title: post.subject,
            description: post.content,
            user: post.authorName,
            date: new Date(post.createdDate).toISOString().split("T")[0],
            imageUrl: "/images/Rectangle.png",
          }))
        : [],

    hot:
      hotPosts.length > 0
        ? hotPosts.map((post) => ({
            href: `/post/detail?id=${post.id}`,
            title: post.subject,
            description: post.content,
            user: post.authorName,
            date: new Date(post.createdDate).toISOString().split("T")[0],
            imageUrl: "/images/Rectangle.png",
          }))
        : [],
  };

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Totee Post</h1>
          <div className={styles.utilBar}>
            <ul className={styles.tabBox}>
              <li
                className={`${activeTab === "recent" ? styles.active : ""}`}
                onClick={() => setActiveTab("recent")}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 2C13 1.44772 12.5523 1 12 1C11.4477 1 11 1.44772 11 2V6C11 6.55228 11.4477 7 12 7C12.5523 7 13 6.55228 13 6V2Z"
                    fill="currentColor"
                  />
                  <path
                    d="M13 18C13 17.4477 12.5523 17 12 17C11.4477 17 11 17.4477 11 18V22C11 22.5523 11.4477 23 12 23C12.5523 23 13 22.5523 13 22V18Z"
                    fill="currentColor"
                  />
                  <path
                    d="M4.22282 4.22289C4.61335 3.83236 5.24651 3.83236 5.63704 4.22289L8.46704 7.05289C8.85756 7.44341 8.85756 8.07658 8.46704 8.4671C8.07651 8.85762 7.44335 8.85762 7.05282 8.4671L4.22282 5.6371C3.8323 5.24658 3.8323 4.61341 4.22282 4.22289Z"
                    fill="currentColor"
                  />
                  <path
                    d="M16.9471 15.5329C16.5566 15.1424 15.9234 15.1424 15.5329 15.5329C15.1424 15.9234 15.1424 16.5566 15.5329 16.9471L18.3629 19.7771C18.7534 20.1676 19.3866 20.1676 19.7771 19.7771C20.1676 19.3866 20.1676 18.7534 19.7771 18.3629L16.9471 15.5329Z"
                    fill="currentColor"
                  />
                  <path
                    d="M1 12C1 11.4477 1.44772 11 2 11H6C6.55228 11 7 11.4477 7 12C7 12.5523 6.55228 13 6 13H2C1.44772 13 1 12.5523 1 12Z"
                    fill="currentColor"
                  />
                  <path
                    d="M18 11C17.4477 11 17 11.4477 17 12C17 12.5523 17.4477 13 18 13H22C22.5523 13 23 12.5523 23 12C23 11.4477 22.5523 11 22 11H18Z"
                    fill="currentColor"
                  />
                  <path
                    d="M8.46704 15.5329C8.85756 15.9234 8.85756 16.5566 8.46704 16.9471L5.63704 19.7771C5.24651 20.1676 4.61335 20.1676 4.22282 19.7771C3.8323 19.3866 3.8323 18.7534 4.22283 18.3629L7.05282 15.5329C7.44335 15.1424 8.07651 15.1424 8.46704 15.5329Z"
                    fill="currentColor"
                  />
                  <path
                    d="M19.7771 5.6371C20.1676 5.24657 20.1676 4.61341 19.7771 4.22289C19.3866 3.83236 18.7534 3.83236 18.3629 4.22289L15.5329 7.05289C15.1424 7.44341 15.1424 8.07658 15.5329 8.4671C15.9234 8.85762 16.5566 8.85762 16.9471 8.4671L19.7771 5.6371Z"
                    fill="currentColor"
                  />
                </svg>
                <span>최신글</span>
              </li>
              <li
                className={`${activeTab === "hot" ? styles.active : ""}`}
                onClick={() => setActiveTab("hot")}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.5128 5.36261C8.6934 3.54319 5.74355 3.54319 3.92413 5.36261C2.10472 7.18202 2.10472 10.1319 3.92413 11.9513L4.70384 12.731C4.71658 12.7437 4.72895 12.7568 4.74093 12.7701L11.9996 20.0289L19.258 12.7705C19.2701 12.7571 19.2825 12.7439 19.2954 12.731L20.0751 11.9513C21.8945 10.1319 21.8945 7.18202 20.0751 5.36261C18.2557 3.54319 15.3059 3.54319 13.4864 5.36261L12.7067 6.14232C12.3162 6.53284 11.683 6.53284 11.2925 6.14232L10.5128 5.36261ZM20.7481 14.1068C20.736 14.1202 20.7236 14.1333 20.7107 14.1462L12.7078 22.1491C12.5202 22.3367 12.2657 22.4421 12.0004 22.442C12.0002 22.442 12.0007 22.442 12.0004 22.442C12.0002 22.442 11.9991 22.442 11.9988 22.442C11.7335 22.4421 11.4791 22.3367 11.2915 22.1491L3.2886 14.1462C3.2757 14.1333 3.26323 14.1202 3.25118 14.1068L2.50992 13.3655C-0.0905439 10.765 -0.0905477 6.54886 2.50992 3.9484C5.11038 1.34793 9.32657 1.34793 11.927 3.9484L11.9996 4.021L12.0722 3.9484C14.6727 1.34793 18.8889 1.34793 21.4893 3.9484C24.0898 6.54886 24.0898 10.765 21.4893 13.3655L20.7481 14.1068Z"
                    fill="currentColor"
                  />
                </svg>
                <span>인기글</span>
              </li>
            </ul>
            <div className={styles.rightBox}>
              {loginStatus ? (
                <LinkButton to="/post/my">My Post</LinkButton>
              ) : (
                <></>
              )}
              <SearchBox></SearchBox>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.containerItemBox}>
          {posts[activeTab].length === 0 ? (
            <NoSearch></NoSearch>
          ) : (
            posts[activeTab].map((post, index) => (
              <PostCard
                key={index}
                href={post.href}
                title={post.title}
                description={post.description}
                user={post.user}
                date={post.date}
                imageUrl={post.imageUrl}
              />
            ))
          )}
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={Math.ceil(posts[activeTab].length / 16)}
      />
    </div>
  );
};

export default Post;
