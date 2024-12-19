"use client";
import React, { useState, useEffect } from "react";
import apiClient from "@/api/axiosConfig";
import styles from "@/styles/pages/mentor/mentor.module.scss";
import Image from "next/image";
import MentorButton from "@/components/button/MentorButton";
import Pagination from "@/components/pagination/custompagination";
import Tag from "@/src/components/tag/tag";
import SearchBox from "@/components/search/SearchBox";
import Link from "next/link";

interface Mentor {
  id: number;
  name: string;
  profileImg: string;
  company: string;
  position: string;
  oneLineBio: string;
}

export default function MentorSearch() {
  const [selectedTags, setSelectedTags] = useState<Array<boolean>>(
    Array(7).fill(false)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const tags = [
    "전체",
    "React",
    "React",
    "React",
    "React",
    "React",
    "임시저장",
  ];

  useEffect(() => {
    fetchMentors();
  }, [currentPage, selectedTags, searchQuery]);

  const fetchMentors = async () => {
    try {
      const response = await apiClient.get("/api/v1/mentors", {
        params: {
          page: currentPage - 1,
          size: 15,
          tags: selectedTags
            .filter((_, index) => index !== 0 && _)
            .map((_, index) => tags[index + 1]),
          query: searchQuery,
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

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
          <Link
            href={`/mentor/detail/${mentor.id}`}
            key={index}
            className={styles.mentorCard}
          >
            <div className={styles.profileImage}>
              <Image
                src={mentor.profileImg || "/default-profile.jpg"}
                alt={mentor.name}
                layout="fill"
                objectFit="cover"
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
          </Link>
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
