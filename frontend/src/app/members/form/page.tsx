"use client";

import React, { useEffect, useState } from "react";
import apiClient from "@/api/axiosConfig";
import TextInput from "@/components/input/TextInput";
import styles from "@/styles/pages/members/form.module.scss";

export default function Join() {
  const [email, setEmail] = useState<string>(""); // 이메일 상태
  const [name, setName] = useState<string>(""); // 이름 상태
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/api/v1/members/me");
        console.log("API Response:", response.data); // API 응답 디버깅
        const { email, name } = response.data.data; // 응답 데이터 구조에서 email과 name 추출
        setEmail(email); // 이메일 상태 업데이트
        setName(name); // 이름 상태 업데이트
      } catch (err: any) {
        console.error(
          "Error fetching data:",
          err.response?.data || err.message || err
        );
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p className={styles.errorText}>{error}</p>;

  return (
    <div className={styles.container}>
      <p className={styles.formTitle}>프로필</p>
      <div className={styles.formbox}>
        {/* 아이디 */}
        <TextInput value={email} isNotModify>
          아이디(E-mail)
        </TextInput>

        {/* 이름 */}
        <TextInput
          value={name} // API에서 가져온 이름이 기본값으로 표시
          onChange={(e) => setName(e.target.value)} // 이름 변경 시 상태 업데이트
        >
          이름
        </TextInput>
      </div>
    </div>
  );
}
