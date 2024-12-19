"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // useRouter import
import apiClient from "@/api/axiosConfig";
import LoginButton from "@/components/button/Loginbutton";
import TextInput from "@/components/input/TextInput";
import Birthday from "@/components/birthday/Birthday";
import GenderButton from "@/components/button/GenderButton";
import styles from "@/styles/pages/members/join.module.scss";

export default function Join() {
  const [email, setEmail] = useState<string>(""); // 이메일 상태
  const [password, setPassword] = useState<string>(""); // 비밀번호 상태
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // 비밀번호 확인 상태
  const [name, setName] = useState<string>(""); // 이름 상태
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
  const [error, setError] = useState<string | null>(null); // 에러 메시지 상태
  const router = useRouter(); // Next.js useRouter 훅

  const register = async () => {
    console.log("test month : " + birthdate.month);
    console.log("test day : " + birthdate.day);

    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (password !== confirmPassword) {
      setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    // 회원가입 요청에 필요한 데이터
    const formData = {
      email,
      password,
      name,
      birthDate: `${birthdate.year}-${birthdate.month}-${birthdate.day}`, // 생년월일 포맷
      gender,
    };

    try {
      // 회원가입 API 호출
      const response = await apiClient.post("/api/v1/members/join", formData);
      console.log("회원가입 성공:", response.data);
      alert("회원가입 성공!");
      router.push("/members"); // 로그인 페이지로 이동
    } catch (err: any) {
      console.error("회원가입 실패:", err.response?.data || err.message);
      setError(err.response?.data?.message || "회원가입에 실패했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.joinTitle}>ToTee Block</p>
      <div className={styles.joinBox}>
        {/* 아이디 입력 */}
        <TextInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.wideInput}
        >
          아이디 (E-mail)
        </TextInput>

        {/* 비밀번호 입력 */}
        <TextInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isPassword
          className={styles.wideInput}
        >
          비밀번호
        </TextInput>

        {/* 비밀번호 확인 입력 */}
        <TextInput
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          isPassword
          className={styles.wideInput}
        >
          비밀번호 확인
        </TextInput>

        {/* 이름 입력 */}
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.wideInput}
        >
          이름
        </TextInput>

        {/* 생년월일 */}
        <Birthday
          value={birthdate}
          onChange={(newValue) => setBirthdate(newValue)} // newValue는 { year, month, day } 형태의 문자열 객체
        />

        {/* 성별 선택 */}
        <GenderButton
          selectedGender={gender}
          onGenderChange={(newGender) => setGender(newGender)}
        />
      </div>

      {/* 에러 메시지 표시 */}
      {error && <p>{error}</p>}

      {/* 회원가입 버튼 */}
      <LoginButton onClick={register}>회원가입</LoginButton>
    </div>
  );
}
