"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchUserProfile } from "@/api/axiosConfig";
import Link from "next/link";
import styles from "@/styles/pages/qna/qna.module.scss";
import MentorButton from "@/components/button/MentorButton";
import SearchBox from "@/components/search/SearchBox";
import Pagination from "@/components/pagination/custompagination";
import YesNoModal from "@/components/modal/YesNoModal";

export default function QnA() {
  const [currentPage, setCurrentPage] = useState(1);
  const [qnAs, setQnAs] = useState([]);
  const [loginStatus, setLoginStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  const checkLogin = async () => {
    const response = await fetchUserProfile();
    console.log(response);
    if (response.resultCode == "200") {
      setLoginStatus(true);
      return;
    }
    setLoginStatus(false);
  };

  const toMyQnA = () => {
    if (!loginStatus) {
      alert("로그인이 필요합니다.");
      location.href = "/members";
      return;
    }

    location.href = "/qna/my";
  };

  useEffect(() => {
    checkLogin();

    const queryParams = new URLSearchParams(window.location.search);
    const page = Number(queryParams.get("page")) || 0;
    const kw = queryParams.get("kw") || "";

    const fetchRecentPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/v1/qnas", {
          params: { page, size: 16, kw },
        });
        const data = response.data.data;
        console.log(data);
        setQnAs(data.content);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch recent posts.");
        setLoading(false);
      }
    };

    fetchRecentPosts(); // 페이지가 로드될 때 데이터 호출
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>ToTee QnA</h1>
      </div>

      <div className={styles.tagSection}>
        <div></div>
        <div className={styles.searchWrapper}>
          <MentorButton onClick={toMyQnA}>My QnA</MentorButton>
          <SearchBox />
        </div>
      </div>

      <div className={styles.content}>
        {qnAs.map((item, index) => (
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
              <span className={styles.date}>
                {new Date(item.createdDate).toISOString().split("T")[0]}
              </span>
              <span className={styles.author}>{item.authorName}</span>
            </div>
          </Link>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={Math.ceil(qnAs.length / itemsPerPage)}
      />

      <YesNoModal></YesNoModal>
    </div>
  );
}
