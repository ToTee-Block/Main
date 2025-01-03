"use client";

import { useState, useEffect } from "react";
import Table from "@/src/components/manager/Table";
import SerchFilter from "@/src/components/manager/SerchFilter";
import Sidebar from "@/src/components/manager/Sidebar";
import Pagination from "@/src/components/manager/Pagination";
import apiClient from "@/api/axiosConfig";
import styles from "@/styles/pages/manager/manager.module.scss";

interface TableItem {
  id: number;
  email: string;
  name: string;
  createdDate: string;
  url?: string;
  role?: string;
}

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
  email: string;
  name: string;
  profileImg: string | null;
}

interface Post {
  id: number;
  subject: string;
  content: string;
  authorEmail: string;
  authorName: string;
  createdDate: string;
  modifiedDate: string;
  techStacks: string[] | null;
  isDraft: boolean;
  likes: number;
  likedByEmails: string[];
  comments: any[];
  thumbnail: string | null;
  filePaths: string[];
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
  const [data, setData] = useState<TableItem[]>([]);
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
          endpoint = "/api/v1/admin/posts";
          break;
        case "reports":
          endpoint = "/api/v1/admin/reports";
          break;
      }

      const params = new URLSearchParams({
        page: String(currentPage - 1),
        size: String(itemsPerPage),
      });

      const response = await apiClient.get<ApiResponse<Member | Mentor | Post>>(
        `${endpoint}?${params.toString()}`
      );

      if (response.data.resultCode === "200") {
        const formattedData = response.data.data.content.map((item: any) => {
          if (activeTab === "posts") {
            return {
              id: item.id,
              email: item.authorEmail,
              name: item.authorName,
              createdDate: formatDate(item.createdDate),
              url: item.subject,
            } as TableItem;
          } else {
            return {
              id: item.id,
              email: item.email,
              name: item.name,
              createdDate: formatDate(item.createdDate),
              role: item.role,
            } as TableItem;
          }
        });
        setData(formattedData);
        setTotalItems(response.data.data.totalElements);
      }
    } catch (error) {
      console.error("데이터 조회 실패:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const message =
      activeTab === "posts"
        ? "이 게시물을 삭제하시겠습니까?"
        : "이 회원을 삭제하시겠습니까?";

    const isConfirmed = window.confirm(message);
    if (isConfirmed) {
      try {
        let endpoint =
          activeTab === "posts"
            ? `/api/v1/admin/posts/${id}`
            : `/api/v1/admin/members/delete/${id}`;

        const response = await apiClient.delete(endpoint);
        if (response.data.resultCode === "200") {
          console.log(`${activeTab === "posts" ? "게시물" : "회원"} 삭제 성공`);
          fetchData();
        }
      } catch (error: any) {
        console.error("삭제 실패:", error);
      }
    }
  };

  const handleApprove = async (mentorId: number, memberId: number) => {
    const isConfirmed = window.confirm("승인하시겠습니까?");
    if (isConfirmed) {
      try {
        const response = await apiClient.post("/api/v1/admin/mentors/approve", {
          mentorId: mentorId.toString(),
          memberId: memberId.toString(),
          approve: "true",
        });

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
          mentorId: mentorId.toString(),
          memberId: memberId.toString(),
          approve: "false",
        });

        if (response.data.resultCode === "200") {
          fetchData();
        }
      } catch (error) {
        console.error("거부 실패:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setSearchFilters(newFilters);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, currentPage]);

  useEffect(() => {
    setActiveTab("members");
  }, []);

  return (
    <div className={styles.container}>
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <div className={styles.content}>
        <SerchFilter
          searchFilters={searchFilters}
          setSearchFilters={handleFilterChange}
          onSearch={handleSearch}
        />
        <Table
          data={data}
          onApprove={activeTab === "mentors" ? handleApprove : undefined}
          onReject={activeTab === "mentors" ? handleReject : undefined}
          onDelete={handleDelete}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          activeTab={activeTab}
        />
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
