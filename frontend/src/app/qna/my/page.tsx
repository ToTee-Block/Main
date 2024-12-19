"use client";

import React, { useState, useEffect } from "react";
import { fetchUserProfile } from "@/api/axiosConfig";
import axios from "axios";
import Link from "next/link";
import styles from "@/styles/pages/qna/myqna.module.scss";
import MentorButton from "@/components/button/MentorButton";
import SearchBox from "@/components/search/SearchBox";
import Pagination from "@/components/pagination/custompagination";
import DivideBar from "@/components/divideBar";

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

export default function QnA() {
  const [me, setMe] = useState<Me>();
  const [currentPage, setCurrentPage] = useState(1);
  const [tags, setTags] = useState<Array<string>>();
  const [selectedTags, setSelectedTags] = useState<Array<boolean>>(
    Array(8).fill(false)
  );
  const [entireQnAs, setEntireQnAs] = useState<string[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const totalPages = 78;
  const itemsPerPage = 10;

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
    const fetchQnAs = async () => {
      const me = await getMe();
      const queryParams = new URLSearchParams(window.location.search);
      const page = Number(queryParams.get("page")) || 0;
      const kw = queryParams.get("kw") || "";

      setCurrentPage(page + 1);

      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/qnas/${me?.email}`,
          {
            params: { page, size: 16, kw },
          }
        );
        const resultCode = response.data.resultCode;
        const data = response.data.data;
        console.log(data);
        if (resultCode === "200") {
          setTags(["전체", ...data.stacks, "임시저장"]);
          setEntireQnAs(data.qnAs.content);
        } else if (resultCode === "401") {
          setError("로그인이 필요합니다.");
          location.href = "/members";
        }
        setIsLoading(false);
      } catch (error) {
        setError("Failed to fetch recent posts.");
        setIsLoading(false);
      }
    };

    fetchQnAs();
  }, [selectedTags]);

  if (isLoading) {
    return null;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const getCurrentDate = () => {
    const date = new Date();
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleTagToggle = (index: number): void => {
    setSelectedTags((prev) => {
      const newState = [...prev];
      if (index === 0) {
        if (prev[0]) {
          return prev.map(() => false);
        }
        return prev.map((_, i) => i === 0);
      } else {
        newState[0] = false;
        newState[index] = !newState[index];
        return newState;
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>
            {me?.name ? `${me?.name}의 QnA` : "사용자의 QnA"}
          </h1>
          <DivideBar width={500}></DivideBar>
        </div>
      </div>

      <div className={styles.utilSection}>
        <div className={styles.airBox}></div>
        <div className={styles.searchWrapper}>
          <Link href="/qna/detail" className={styles.linkWrapper}>
            <MentorButton>질문하기</MentorButton>
          </Link>
          <SearchBox />
        </div>
      </div>

      <div className={styles.content}>
        {entireQnAs?.map((item, index) => (
          <Link
            href={`/qna/detail?id=${item.id}`}
            key={item.id}
            className={styles.qnaItem}
          >
            <div className={styles.numberWrapper}>
              <span className={styles.number}>
                {String(index + 1).padStart(2, "0")}.
              </span>
            </div>
            <div className={styles.questionWrapper}>
              <span className={styles.question}>{item.subject}</span>
            </div>
            <div className={styles.metaWrapper}>
              <span className={styles.date}>{item.createdDate}</span>
              <span className={styles.author}>{item.authorName}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.paginationWrapper}>
        <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={Math.ceil(entireQnAs?.length / itemsPerPage)}
        />
      </div>
    </div>
  );
}
