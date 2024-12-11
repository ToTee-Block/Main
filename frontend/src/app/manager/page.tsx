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

export default function ManagerPage() {
  const [activeTab, setActiveTab] = useState("memberManage");
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

  const fetchData = async () => {
    try {
      let endpoint = "";
      switch (activeTab) {
        case "memberManage":
          endpoint = "/api/v1/admin/members";
          break;
        case "memberApproval":
          endpoint = "/api/v1/admin/mentors";
          break;
        case "postManagement":
          endpoint = "/api/v1/admin/posts";
          break;
        case "reportManagement":
          endpoint = "/api/v1/admin/reports";
          break;
      }
      const response = await apiClient.get(
        `${endpoint}?page=${currentPage - 1}`
      );
      if (response.data.resultCode === "200") {
        setMembers(response.data.data.content);
        setTotalItems(response.data.data.totalElements);
      }
    } catch (error) {
      console.error("데이터 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, currentPage]);

  const handleApprove = async (id: number) => {
    try {
      const response = await apiClient.post(
        `/api/v1/admin/${activeTab}/approve/${id}`
      );
      if (response.data.resultCode === "200") {
        fetchData();
      }
    } catch (error) {
      console.error("승인 실패:", error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await apiClient.post(
        `/api/v1/admin/${activeTab}/reject/${id}`
      );
      if (response.data.resultCode === "200") {
        fetchData();
      }
    } catch (error) {
      console.error("거부 실패:", error);
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
          onSearch={fetchData}
        />
        <Table
          members={members}
          onApprove={handleApprove}
          onReject={handleReject}
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
