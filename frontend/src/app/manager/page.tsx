"use client";

import { useState, useEffect } from "react";
import { Member } from "@/src/components/manager/Member";
import Table from "@/src/components/manager/Table";
import SerchFilter from "@/src/components/manager/SerchFilter";
import Sidebar from "@/src/components/manager/Sidebar";
import Pagination from "@/src/components/manager/Pagination";
import apiClient from "@/api/axiosConfig";
import styles from "@/styles/pages/manager/manager.module.scss";

interface SearchFilters {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export default function ManagerPage() {
  const [activeTab, setActiveTab] = useState("memberApproval");
  const [members, setMembers] = useState<Member[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // 1부터 시작하도록 수정
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    id: "",
    name: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (activeTab === "memberApproval") {
      fetchMembers();
    }
  }, [activeTab, currentPage]);

  const fetchMembers = async () => {
    try {
      const response = await apiClient.get(
        `/api/v1/admin/members?page=${currentPage - 1}` // API 요청시 0부터 시작하는 페이지로 변환
      );
      if (response.data.resultCode === "200") {
        setMembers(response.data.data.content);
        setTotalItems(response.data.data.totalElements); // 전체 아이템 수 설정
      }
    } catch (error) {
      console.error("회원 목록 조회 실패:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await apiClient.delete(
        `/api/v1/admin/members/delete/${id}`
      );
      if (response.data.resultCode === "200") {
        fetchMembers();
      }
    } catch (error) {
      console.error("회원 삭제 실패:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className={styles.content}>
        <SerchFilter
          searchFilters={searchFilters}
          setSearchFilters={setSearchFilters}
          onSearch={fetchMembers}
        />
        <Table
          members={members}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onApprove={(id) => console.log("승인:", id)}
          onReject={handleDelete}
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
