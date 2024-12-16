"use client";

import React, { useState, useEffect } from "react";
import { fetchUserProfile } from "@/api/axiosConfig";
import axios from "axios";
import styles from "@/styles/pages/post/my/my.module.scss";
import SearchBox from "@/components/search/SearchBox";
import LinkButton from "@/components/button/LinkButton";
import PostCard from "@/components/card/PostCard";
import StackCTGY from "@/components/category/StackCTGY";
import DivideBar from "@/components/divideBar";
import NoSearch from "@/components/exception/NoSearch";
import Pagination from "@/components/pagination/custompagination";

interface Me {
  birthDate: string;
  createdDate: string;
  email: string;
  gender: string;
  id: number;
  modifiedDate: string;
  name: string;
  profileImg: string;
  role: string;
}

const Post: React.FC = () => {
  const [me, setMe] = useState<Me>();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [stacks, setStacks] = useState<string[]>();
  const [entirePosts, setEntirePosts] = useState<any[]>([]); // 타입을 배열로 지정
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getMe = async () => {
    const response = await fetchUserProfile();
    const data = response.data;
    if (response.resultCode === "200") {
      setMe(data);
      return data;
    }
    alert("로그인이 필요합니다.");
    location.href = "/members";
    return false;
  };

  const addToStacks = (newData: string[]) => {
    setStacks((prevStacks) => {
      const newStacks = [...prevStacks]; // 기존 배열 복사
      newStacks.splice(1, 0, ...newData); // 인덱스 1에 새로운 배열을 펼쳐서 삽입
      return newStacks;
    });
  };

  useEffect(() => {
    const fetchRecentPosts = async () => {
      const me = await getMe();
      if (me?.email) {
        const queryParams = new URLSearchParams(window.location.search);
        const page = Number(queryParams.get("page")) || 0;
        const kw = queryParams.get("kw") || "";

        setCurrentPage(page + 1);

        try {
          const response = await axios.get(
            `http://localhost:8081/api/v1/posts/${me?.email}`,
            {
              params: { page, size: 16, kw },
            }
          );
          const resultCode = response.data.resultCode;
          const data = response.data.data;
          if (resultCode === "200") {
            setStacks(["All", ...data.stacks, "Draft"]);
            setEntirePosts(data.posts.content);
          } else if (resultCode === "401") {
            setError("로그인이 필요합니다.");
            location.href = "/members";
          }
          setLoading(false);
        } catch (error) {
          setError("Failed to fetch recent posts.");
          setLoading(false);
        }
      }
    };

    fetchRecentPosts();
  }, [activeTab]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const posts = stacks.reduce((acc, stack) => {
    if (stack === "All") {
      acc[stack] =
        entirePosts.length > 0
          ? entirePosts
              .filter((post) => post.isDraft === false)
              .map((post) => ({
                key: post.id,
                href: `/post/detail?id=${post.id}`,
                title: post.subject,
                description: post.content,
                user: post.authorName,
                date: new Date(post.createdDate).toISOString().split("T")[0],
                imageUrl: "/images/Rectangle.png",
              }))
          : [];
    } else if (stack === "Draft") {
      acc[stack] =
        entirePosts.length > 0
          ? entirePosts
              .filter((post) => post.isDraft === true)
              .map((post) => ({
                key: post.id,
                href: `/post/detail?id=${post.id}`,
                title: post.subject,
                description: post.content,
                user: post.authorName,
                date: new Date(post.createdDate).toISOString().split("T")[0],
                imageUrl: "/images/Rectangle.png",
              }))
          : [];
    }
    // stack에 해당하는 techStacks이 포함된 게시물만 필터링
    else {
      acc[stack] =
        entirePosts.length > 0
          ? entirePosts
              .filter(
                (post) =>
                  (post.techStacks ?? []).includes(stack) &&
                  post.isDraft === false
              )
              .map((post) => ({
                key: post.id,
                href: `/post/detail?id=${post.id}`,
                title: post.subject,
                description: post.content,
                user: post.authorName,
                date: new Date(post.createdDate).toISOString().split("T")[0],
                imageUrl: "/images/Rectangle.png",
              }))
          : [];
    }
    return acc;
  }, {});

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{me?.name}의 Totee Blocks</h1>
          <DivideBar width={500}></DivideBar>
          <div className={styles.utilBar}>
            <StackCTGY
              stacks={stacks}
              disabled={false}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            ></StackCTGY>
            <div className={styles.rightBox}>
              <LinkButton to="/post/form">글쓰기</LinkButton>
              <SearchBox></SearchBox>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.containerItemBox}>
          {posts[activeTab]?.length === 0 ? (
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
