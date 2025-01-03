"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import apiClient from "@/api/axiosConfig";
import styles from "@/styles/pages/mentor/mentor.module.scss";
import MentorButton from "@/components/button/MentorButton";
import Pagination from "@/components/pagination/custompagination";
import Tag from "@/src/components/tag/tag";
import SearchBox from "@/components/search/SearchBox";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Mentor {
  id: number;
  name: string;
  profileImg: string;
  company: string;
  position: string;
  oneLineBio: string;
}

export default function MentorSearch() {
  const [tags, setTags] = useState<Array<string>>([""]);
  const [selectedTags, setSelectedTags] = useState<string[]>(["전체"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      await fetchTags();
      fetchMentors();
    };

    fetch();
  }, [currentPage, selectedTags, searchQuery]);

  const fetchTags = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/v1/techStacks`
      );
      const resultCode = response.data.resultCode;
      const data = response.data.data;
      if (resultCode === "200") {
        setTags(["전체", ...data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMentors = async () => {
    try {
      const response = await apiClient.get("/api/v1/mentors", {
        params: {
          // page: currentPage - 1,
          // size: 15,
          // tags: selectedTags,
          // query: searchQuery,
        },
      });
      if (response.data.resultCode === "200") {
        setMentors(response.data.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("멘토 데이터 조회 실패:", error);
    }
  };

  const handleTagToggle = (tagName: string): void => {
    setSelectedTags((prev) => {
      let newState = [...prev];
      if (tagName === "전체") {
        return ["전체"];
      } else {
        if (newState.indexOf("전체") !== -1) {
          newState = newState.filter((item) => item !== "전체");
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  useEffect(() => {
    try {
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>ToTee Mentor</h1>
      </div>
      <div className={styles.tagSection}>
        <Tag
          tags={tags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />
        <div className={styles.searchWrapper}>
          <Link href="/mentor/mymentor" className={styles.linkWrapper}>
            <MentorButton>My Mentor</MentorButton>
          </Link>
          <SearchBox onClick={handleSearch} disabled={false} />
        </div>
      </div>

      <div className={styles.mentorGrid}>
        {mentors.map((mentor, index) => (
          <div
            key={mentor.id}
            className={styles.mentorCard}
            onClick={() => router.push(`/mentor/detail/${mentor.id}`)}
          >
            <div className={styles.profileImage}>
              <img
                src={
                  mentor.profileImg
                    ? `/uploaded/${mentor.profileImg}`
                    : "/icon/user.svg"
                }
                alt={mentor.name}
              />
            </div>
            <div className={styles.mentorInfo}>
              <div className={styles.nameWrapper}>
                <span className={styles.nameText}>{mentor.name}</span>
                <span className={styles.mentorText}>멘토</span>
              </div>
              <div className={styles.infoWrapper}>
                <span className={styles.company}>{mentor.company}</span>
                <span className={styles.position}>{mentor.position}</span>
              </div>
              <div className={styles.descriptionWrapper}>
                <span className={styles.description}>{mentor.oneLineBio}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
