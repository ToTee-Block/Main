"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from '@/styles/pages/post/my/my.module.scss';
import SearchBox from '@/components/search/SearchBox';
import LinkButton from '@/components/button/LinkButton';
import PostCard from '@/components/card/PostCard';
import StackCTGY from "@/components/category/StackCTGY";
import DivideBar from "@/components/divideBar";
import NoSearch from "@/components/exception/NoSearch";

const Post: React.FC = () => {
  const [username, setUsername] = useState<string>("Admin");
  const [userEmail, setUseremail] = useState<string>("admin@email.com");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [stacks, setStacks] = useState<string[]>(["All", "Draft"]);
  const [entirePosts, setEntirePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [posts, setPosts] = useState({
    All: entirePosts.length > 0 ? entirePosts.map(post => ({
      href: `/post?id=${post.id}`, 
      title: post.subject,
      description: post.content,
      user: post.authorName,
      date: new Date(post.createdDate).toISOString().split('T')[0],

      imageUrl: '/images/Rectangle.png',
    })) : [],
  });

  const addToStacks = (newData: string[]) => {
    setStacks((prevStacks) => {
      const newStacks = [...prevStacks]; // 기존 배열 복사
      newStacks.splice(1, 0, ...newData);  // 인덱스 1에 새로운 배열을 펼쳐서 삽입
      return newStacks;
    });
  };

  const addToPosts = (newData: string[]) => {
    setPosts((prevPosts) => {
      const newPosts = { ...prevPosts }; // 기존의 posts 상태를 복사
  
      // 각 스택에 대해서 포스트를 필터링하여 추가
      newData.forEach((stack) => {
        newPosts[stack] = entirePosts
          .filter((post) => post.techStacks.includes(stack) && post.isDraft === false) // stack이 포함된 포스트만 필터링
          .map((post) => ({
            href: `/post?id=${post.id}`,
            title: post.subject,
            description: post.content,
            user: post.authorName,
            date: new Date(post.createdDate).toISOString().split('T')[0],
            imageUrl: '/images/Rectangle.png',
          }));
      });

      // 임시저장 글만 따로 추가
      newPosts["Draft"] = entirePosts
        .filter((post) => post.isDraft === true) // isDraft가 true인 포스트만 필터링
        .map((post) => ({
          href: `/post?id=${post.id}`,
          title: post.subject,
          description: post.content,
          user: post.authorName,
          date: new Date(post.createdDate).toISOString().split('T')[0],
          imageUrl: '/images/Rectangle.png',
        }));
  
      return newPosts; // 새로운 posts 객체 반환
    });
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const page = Number(queryParams.get("page")) || 0;   //기본값을 0로 설정
    const kw = queryParams.get("kw") || "";  // 기본값은 빈 문자열

    const fetchRecentPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/v1/post/${userEmail}`, {
          params: { page, size: 16, kw },
        });

        console.log(response.data);
        const resultCode = response.data.resultCode;
        if (resultCode == "200") {
          addToStacks(response.data.data.stacks);
          setEntirePosts(response.data.data.posts);
          addToPosts(response.data.data.stacks);
          console.log(entirePosts);
        } else if (resultCode == "401") {
          setError("로그인이 필요합니다.");
          location.href = "/members";
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch recent posts.");
        console.log(error);
        setLoading(false);
      }
    };

    fetchRecentPosts(); // 페이지가 로드될 때 데이터 호출
  }, []); // 빈 배열을 넣어 컴포넌트가 마운트될 때 한 번만 호출

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


  return (
    <div className={styles.bodyContainer}>
      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{username}의 Totee Blocks</h1>
          <DivideBar width={500}></DivideBar>
          <div className={styles.utilBar}>
            <StackCTGY
              stacks={stacks}
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
    </div>
  );
}

export default Post;