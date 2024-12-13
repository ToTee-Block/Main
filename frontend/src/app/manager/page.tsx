"use client";

import { useState, useEffect } from "react";
import Table from "@/src/components/manager/Table";
import SerchFilter from "@/src/components/manager/SerchFilter";
import Sidebar from "@/src/components/manager/Sidebar";
import Pagination from "@/src/components/manager/Pagination";
import apiClient from "@/api/axiosConfig";
import styles from "@/styles/pages/manager/manager.module.scss";

interface Member {
  id: number;
  createdDate: string;
  modifiedDate: string;
  email: string;
  name: string;
  birthDate: string;
  gender: string;
  profileImg: string | null;
  role: string;
  myMentors: any[];
  reviews: any[];
}

interface Mentor {
  id: number;
  createdDate: string;
  modifiedDate: string;
  member: Member;
  bio: string;
  approved: boolean;
  matchingStatus: boolean;
  oneLineBio: string;
  portfolio: string;
  myMentees: any[];
  reviews: any[];
  techStacks: any[];
}

interface Post {
  id: number;
  email: string;
  name: string;
  createdDate: string;
  url: string;
}

interface SearchFilters {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface ApiResponse<T> {
  resultCode: string;
  msg: string;
  data: {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}

export default function ManagerPage() {
  const [activeTab, setActiveTab] = useState("members");
  const [data, setData] = useState<(Member | Mentor)[]>([]);
  const [postData, setPostData] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    id: "",
    name: "",
    startDate: "",
    endDate: "",
  });

  const fetchData = async () => {
    try {
      let endpoint = "";
      switch (activeTab) {
        case "members":
          endpoint = "/api/v1/admin/members";
          break;
        case "mentors":
          endpoint = "/api/v1/admin/mentors";
          break;
        case "posts":
          endpoint = "/api/v1/post/admin";
          break;
        case "reports":
          endpoint = "/api/v1/admin/reports";
          break;
      }

      const params = new URLSearchParams();
      if (searchFilters.id) params.append("email", searchFilters.id);
      if (searchFilters.name) params.append("name", searchFilters.name);
      if (searchFilters.startDate)
        params.append("createdDate", searchFilters.startDate);
      if (searchFilters.endDate)
        params.append("endDate", searchFilters.endDate);
      params.append("page", String(currentPage - 1));

      const response = await apiClient.get<ApiResponse<Member | Mentor | Post>>(
        `${endpoint}?${params.toString()}`
      );

      if (response.data.resultCode === "200") {
        if (activeTab === "posts") {
          const formattedData = response.data.data.content.map((item) => ({
            ...item,
            createdDate: formatDate((item as Post).createdDate),
          }));
          setPostData(formattedData as Post[]);
        } else {
          const formattedData = response.data.data.content.map((item) => ({
            ...item,
            createdDate: formatDate(
              activeTab === "mentors"
                ? (item as Mentor).createdDate
                : (item as Member).createdDate
            ),
          }));
          setData(formattedData as (Member | Mentor)[]);
        }
        setTotalItems(response.data.data.totalElements);
      }
    } catch (error) {
      console.error("데이터 조회 실패:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, currentPage]);

  const handleApprove = async (mentorId: number, memberId: number) => {
    const isConfirmed = window.confirm("승인하시겠습니까?");
    if (isConfirmed) {
      try {
        const requestData = {
          mentorId: mentorId,
          memberId: memberId,
          approve: true,
        };

        console.log("멘토 승인 요청 데이터:", requestData);

        const response = await apiClient.post(
          "/api/v1/admin/mentors/approve",
          requestData
        );
        console.log("멘토 승인 응답:", response.data);

        if (response.data.resultCode === "200") {
          console.log("멘토 승인 성공");
          fetchData();
        }
      } catch (error) {
        console.error("승인 실패:", error);
      }
    }
  };

  const handleReject = async (mentorId: number, memberId: number) => {
    const isConfirmed = window.confirm("거부하시겠습니까?");
    if (isConfirmed) {
      try {
        const response = await apiClient.post("/api/v1/admin/mentors/approve", {
          mentorId: mentorId,
          memberId: memberId,
          approve: false,
        });

        if (response.data.resultCode === "200") {
          fetchData();
        }
      } catch (error) {
        console.error("거부 실패:", error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm("삭제하시겠습니까?");
    if (isConfirmed) {
      try {
        const response = await apiClient.delete(
          `/api/v1/admin/members/delete/${id}`
        );
        if (response.data.resultCode === "200") {
          fetchData();
        }
      } catch (error) {
        console.error("삭제 실패:", error);
      }
    }
  };

  const handlePostDelete = async (id: number) => {
    const isConfirmed = window.confirm("게시글을 삭제하시겠습니까?");
    if (isConfirmed) {
      try {
        const response = await apiClient.delete(`/api/v1/post/admin/${id}`);
        if (response.data.resultCode === "200") {
          fetchData();
        }
      } catch (error) {
        console.error("게시글 삭제 실패:", error);
      }
    }
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setSearchFilters(newFilters);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  return (
    <div className={styles.container}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className={styles.content}>
        <SerchFilter
          searchFilters={searchFilters}
          setSearchFilters={handleFilterChange}
          onSearch={handleSearch}
        />
        <Table
          data={activeTab === "posts" ? postData : data}
          onApprove={
            activeTab === "mentors"
              ? (mentorId, memberId) => handleApprove(mentorId, memberId)
              : undefined
          }
          onReject={
            activeTab === "mentors"
              ? (mentorId, memberId) => handleReject(mentorId, memberId)
              : undefined
          }
          onDelete={
            activeTab === "posts"
              ? handlePostDelete
              : activeTab === "members"
              ? handleDelete
              : undefined
          }
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          activeTab={activeTab}
        />
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
