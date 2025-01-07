"use client";
import React, { useState, useEffect } from "react";
import { fetchUserProfile } from "@/api/axiosConfig";
import axios from "axios";
import styles from "@/styles/pages/mentor/mymentor.module.scss";
import Pagination from "@/components/pagination/custompagination";
import Tag from "@/src/components/tag/tag";
import MentorButton from "@/components/button/MentorButton";
import SearchBox from "@/components/search/SearchBox";
import NoSearch from "@/components/exception/NoSearch";
import { useRouter } from "next/navigation";

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

interface Mentor {
  id: number;
  name: string;
  profileImg: string;
  company: string;
  position: string;
  oneLineBio: string;
}

export default function MyMentor() {
  const [me, setMe] = useState<Me>();
  const [tags, setTags] = useState<Array<string>>([""]);
  const [selectedTags, setSelectedTags] = useState<string[]>(["전체"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      await fetchTags();
    };

    const fetchRecentPosts = async () => {
      const me = await getMe();
      if (!me) {
        alert("로그인이 필요합니다.");
        location.href = "/members";
      }

      const queryParams = new URLSearchParams(window.location.search);
      const page = Number(queryParams.get("page")) || 0;

      setCurrentPage(page + 1);

      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/mentors/my/${me?.id}`,
          {
            params: { page, size: 16 },
          }
        );
        const resultCode = response.data.resultCode;
        const msg = response.data.msg;
        const data = response.data.data;
        console.log(response);
        console.log(data);
        if (resultCode === "200") {
          setMentors(data.content);
          setTotalPages(data.totalPages);
        } else {
          console.log(msg);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
    fetchRecentPosts();
  }, []);

  const getMe = async () => {
    const response = await fetchUserProfile();
    const data = response.data;
    if (response.resultCode === "200") {
      setMe(data);
      return data;
    }
    return false;
  };

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

  useEffect(() => {
    try {
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{me?.name}의 Mentor</h1>
      </div>
      <div className={styles.tagSection}>
        <div className={styles.tagBox}>
          <Tag
            tags={tags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
          />
        </div>
        <div className={styles.searchWrapper}>
          <MentorButton
            onClick={() => {
              location.href = "/mentor";
            }}
          >
            Mentor
          </MentorButton>
          <SearchBox />
        </div>
      </div>

      <div className={styles.mentorGrid}>
        {selectedTags[0] === "전체" ? (
          mentors.length === 0 ? (
            <NoSearch></NoSearch>
          ) : (
            mentors.map((mentor, index) => (
              <div
                key={mentor.id}
                className={styles.mentorCard}
                onClick={() => router.push(`/mentor/detail/${mentor.memberID}`)}
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
                    <span className={styles.description}>
                      {mentor.oneLineBio}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )
        ) : mentors.filter((mentor) =>
            selectedTags.every((stack) => mentor.techStacks?.includes(stack))
          ).length === 0 ? (
          <NoSearch></NoSearch>
        ) : (
          mentors
            .filter((mentor) =>
              selectedTags.every((stack) => mentor.techStacks?.includes(stack))
            )
            .map((mentor, index) => (
              <div
                key={mentor.id}
                className={styles.mentorCard}
                onClick={() => router.push(`/mentor/detail/${mentor.memberID}`)}
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
                    <span className={styles.description}>
                      {mentor.oneLineBio}
                    </span>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
