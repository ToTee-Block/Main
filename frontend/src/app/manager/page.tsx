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
  email: string;
  username: string;
  createDate: string;
  status: string;
}

interface SearchFilters {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface SearchFilterProps {
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
  onSearch: () => void;
}

export default function ManagerPage() {
  const [activeTab, setActiveTab] = useState("memberApproval");
  const [members, setMembers] = useState<Member[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    id: "",
    name: "",
    startDate: "",
    endDate: "",
  });

  const fetchMembers = async () => {
    try {
      const response = await apiClient.get(
        `/api/v1/admin/members?page=${currentPage - 1}`
      );
      if (response.data.resultCode === "200") {
        setMembers(response.data.data.content);
        setTotalItems(response.data.data.totalElements);
      }
    } catch (error) {
      console.error("회원 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "memberApproval") {
      fetchMembers();
    }
  }, [activeTab, currentPage]);

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

  const handleFilterChange = (newFilters: SearchFilters) => {
    setSearchFilters(newFilters);
  };

  return (
    <div className={styles.container}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className={styles.content}>
        <SerchFilter
          searchFilters={searchFilters}
          setSearchFilters={handleFilterChange}
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
