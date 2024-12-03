"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Next.js의 라우터 사용
import apiClient from "@/api/axiosConfig";
import Birthday from "@/components/birthday/Birthday";
import TextInput from "@/components/input/TextInput";
import GenderButton from "@/components/button/GenderButton";
import LoginButton from "@/components/button/Loginbutton";
import styles from "@/styles/pages/members/form.module.scss";

export default function Join() {
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

  const router = useRouter(); // Next.js 라우터 사용

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/api/v1/members/me");
        console.log("API Response:", response.data); // API 응답 디버깅
        const { email, name, birthDate, gender } = response.data.data;

        setEmail(email);
        setName(name);

        if (birthDate) {
          const [year, month, day] = birthDate.split("-");
          setBirthdate({ year, month, day });
        }

        setGender(gender);
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

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const updateData = {
        name,
        birthDate: `${birthdate.year}-${birthdate.month}-${birthdate.day}`,
        gender,
      };

      const response = await apiClient.patch(
        "/api/v1/members/profile",
        updateData
      );
      console.log("Update Response:", response.data);

      // 성공적으로 업데이트가 완료되면 메인 페이지로 이동
      router.push("/");
    } catch (err: any) {
      console.error(
        "Error updating data:",
        err.response?.data || err.message || err
      );
      setError("데이터 업데이트에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

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
        <TextInput value={name} onChange={(e) => setName(e.target.value)}>
          이름
        </TextInput>

        {/* 생년월일 */}
        <Birthday
          value={birthdate}
          onChange={(newValue) => setBirthdate(newValue)}
        />

        {/* 성별 선택 */}
        <GenderButton
          selectedGender={gender}
          onGenderChange={(newGender) => setGender(newGender)}
        />
      </div>
      {/* 수정버튼 */}
      <LoginButton onClick={handleUpdate}>수정</LoginButton>
    </div>
  );
}
