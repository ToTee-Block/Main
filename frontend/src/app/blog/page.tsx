"use client";

import React, { useState, useEffect } from "react";
import { fetchUserProfile } from "@/api/axiosConfig";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "@/styles/pages/blog/blog.module.scss";
import SearchBox from "@/components/search/SearchBox";
import PostCard from "@/components/card/PostCard";
import Tag from "@/components/tag/tag";
import DivideBar from "@/components/divideBar";
import NoSearch from "@/components/exception/NoSearch";
import Pagination from "@/components/pagination/custompagination";
import MentorButton from "@/components/button/MentorButton";

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
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [stacks, setStacks] = useState<string[]>();
  const [selectedStacks, setSelectedStacks] = useState<string[]>(["전체"]);
  const [entirePosts, setEntirePosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = () => {
    // sessionStorage에 데이터를 저장
    sessionStorage.setItem("postingType", "posts");
    sessionStorage.setItem("id", "");

    // 페이지 이동
    router.push("/editor");
  };

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
            setStacks(["전체", ...data.stacks, "임시저장"]);
            setEntirePosts(data.posts.content);
            console.log(data.posts.content);
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
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleTagToggle = (tagName: string): void => {
    setSelectedStacks((prev) => {
      let newState = [...prev];
      if (tagName === "전체") {
        return ["전체"];
      } else if (tagName === "임시저장") {
        return ["임시저장"];
      } else {
        if (
          newState.indexOf("전체") !== -1 ||
          newState.indexOf("임시저장") !== -1
        ) {
          newState = newState.filter(
            (item) => item !== "전체" && item !== "임시저장"
          );
        }
        if (newState.includes(tagName)) {
          newState = newState.filter((item) => item !== tagName);
          if (newState.length === 0) newState = ["전체"];
        } else {
          newState.push(tagName);
        }
        return newState;
      }
    });
  };

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{me?.name}의 Totee Blocks</h1>
          <DivideBar width={500}></DivideBar>
          <div className={styles.utilBar}>
            <div className={styles.tagBox}>
              <Tag
                tags={stacks}
                selectedTags={selectedStacks}
                onTagToggle={handleTagToggle}
              />
            </div>
            <div className={styles.rightBox}>
              <MentorButton onClick={handleSubmit}>글쓰기</MentorButton>
              <SearchBox></SearchBox>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.containerItemBox}>
          {selectedStacks[0] === "전체" ? (
            entirePosts.filter((post) => post.isDraft === false).length ===
            0 ? (
              <NoSearch></NoSearch>
            ) : (
              entirePosts
                .filter((post) => post.isDraft === false)
                .map((post, index) => (
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
                ))
            )
          ) : selectedStacks[0] === "임시저장" ? (
            entirePosts.filter((post) => post.isDraft === true).length === 0 ? (
              <NoSearch></NoSearch>
            ) : (
              entirePosts
                .filter((post) => post.isDraft === true)
                .map((post, index) => (
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
                ))
            )
          ) : entirePosts.filter(
              (post) =>
                selectedStacks.every((stack) =>
                  post.techStacks?.includes(stack)
                ) && post.isDraft === false
            ).length === 0 ? (
            <NoSearch></NoSearch>
          ) : (
            entirePosts
              .filter(
                (post) =>
                  selectedStacks.every((stack) =>
                    post.techStacks?.includes(stack)
                  ) && post.isDraft === false
              )
              .map((post, index) => (
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
              ))
          )}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={Math.ceil(entirePosts.length / 16)}
      />
    </div>
  );
};

export default Post;
