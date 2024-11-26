"use client";

import React, { useState } from "react";
import axios from "axios";
import LoginButton from "@/components/button/Loginbutton";
import TextInput from "@/components/input/TextInput";
import Birthday from "@/components/birthday/Birthday";
import GenderButton from "@/components/button/GenderButton";
import styles from "@/styles/pages/members/join.module.scss";

export default function Join() {
  const [email, setEmail] = useState<string>(""); // 이메일
  const [password, setPassword] = useState<string>(""); // 비밀번호
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // 비밀번호 확인
  const [name, setName] = useState<string>(""); // 이름
  const [birthdate, setBirthdate] = useState<{
    year: string;
    month: string;
    day: string;
  }>({
    year: "",
    month: "",
    day: "",
  }); // 생년월일
  const [gender, setGender] = useState<string>(""); // 성별
  const [error, setError] = useState<string | null>(null); // 에러 메시지

  // 회원가입 요청 함수
  const register = async () => {
    if (password !== confirmPassword) {
      setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    const formData = {
      email,
      password,
      name,
      birthDate: `${birthdate.year}-${birthdate.month}-${birthdate.day}`, // 생년월일을 문자열로 변환
      gender,
    };

    try {
      const response = await axios.post("/api/v1/members/join", formData);
      console.log("회원가입 성공:", response.data);
      alert("회원가입 성공!");
    } catch (error: any) {
      console.error("회원가입 실패:", error.response?.data || error.message);
      setError(error.response?.data?.message || "회원가입에 실패했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.joinTitle}>ToTee Block</p>
      <div className={styles.joinBox}>
        {/* 아이디 입력 */}
        <TextInput value={email} onChange={(e) => setEmail(e.target.value)}>
          아이디 (E-mail)
        </TextInput>

        {/* 비밀번호 입력 */}
        <TextInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isPassword
        >
          비밀번호
        </TextInput>

        {/* 비밀번호 확인 입력 */}
        <TextInput
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          isPassword
        >
          비밀번호 확인
        </TextInput>

        {/* 이름 입력 */}
        <TextInput value={name} onChange={(e) => setName(e.target.value)}>
          이름
        </TextInput>

        {/* 생년월일 */}
        <Birthday
          value={birthdate}
          onChange={(newValue) => setBirthdate(newValue)} // newValue는 { year, month, day } 형태의 객체
        />

        {/* 성별 선택 */}
        <GenderButton
          selectedGender={gender}
          onGenderChange={(newGender) => setGender(newGender)}
        />
      </div>

      {/* 에러 메시지 표시 */}
      {error && <p className={styles.error}>{error}</p>}

      {/* 회원가입 버튼 */}
      <LoginButton onClick={register}>회원가입</LoginButton>
    </div>
  );
}
