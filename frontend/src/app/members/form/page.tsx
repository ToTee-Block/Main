"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/api/axiosConfig";
import Birthday from "@/components/birthday/Birthday";
import TextInput from "@/components/input/TextInput";
import GenderButton from "@/components/button/GenderButton";
import LoginButton from "@/components/button/Loginbutton";
import styles from "@/styles/pages/members/form.module.scss";

export default function ProfileForm() {
  const [email, setEmail] = useState<string>(""); // 이메일 상태
  const [name, setName] = useState<string>(""); // 이름 상태
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태
  const [birthdate, setBirthdate] = useState<{
    year: string;
    month: string;
    day: string;
  }>({
    year: "",
    month: "",
    day: "",
  }); // 생년월일 상태
  const [gender, setGender] = useState<string | null>(null); // 성별 상태

  const router = useRouter();

  // 사용자 데이터를 가져오는 함수
  const fetchMemberData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/v1/members/me");
      console.log("API Response:", response.data);

      const { email, name, birthDate, gender } = response.data.data;
      setEmail(email);
      setName(name);

      if (birthDate) {
        const [year, month, day] = birthDate.split("-");
        setBirthdate({ year, month, day });
      }

      setGender(gender);
    } catch (err: any) {
      console.error("Error fetching data:", err.response?.data || err.message);

      if (err.response?.status === 403) {
        setError("권한이 없습니다. 로그인 페이지로 이동합니다.");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError("데이터를 불러오는 데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 프로필 업데이트 함수
  const handleUpdate = async () => {
    try {
      setLoading(true);

      if (
        !email ||
        !name ||
        !birthdate.year ||
        !birthdate.month ||
        !birthdate.day ||
        !gender
      ) {
        setError("모든 필드를 올바르게 입력해주세요.");
        return;
      }

      const updateData = {
        email, // 이메일 포함
        name,
        birthDate: `${birthdate.year}-${birthdate.month}-${birthdate.day}`,
        gender,
      };

      const response = await apiClient.patch(
        "/api/v1/members/profile",
        updateData
      );
      console.log("Update Response:", response.data);

      alert("프로필이 성공적으로 업데이트되었습니다!");
      router.push("/"); // 메인 페이지로 리다이렉트
    } catch (err: any) {
      console.error("Error updating data:", err.response?.data || err.message);

      if (err.response?.status === 403) {
        setError("권한이 없습니다. 로그인 페이지로 이동합니다.");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError("데이터 업데이트에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("JWT Token:", localStorage.getItem("token"));
    fetchMemberData();
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error)
    return (
      <div>
        <p className={styles.errorText}>{error}</p>
      </div>
    );

  return (
    <div className={styles.container}>
      <p className={styles.formTitle}>프로필</p>
      <div className={styles.formbox}>
        {/* 이메일 (수정 불가) */}
        <TextInput value={email} isNotModify>
          이메일
        </TextInput>

        {/* 이름 */}
        <TextInput value={name} onChange={(e) => setName(e.target.value)}>
          이름
        </TextInput>

        {/* 생년월일 */}
        <Birthday
          value={birthdate}
          onChange={(newValue) => setBirthdate(newValue)}
        />

        {/* 성별 */}
        <GenderButton
          selectedGender={gender}
          onGenderChange={(newGender) => setGender(newGender)}
        />
      </div>
      {/* 수정 버튼 */}
      <LoginButton onClick={handleUpdate}>수정</LoginButton>
    </div>
  );
}
