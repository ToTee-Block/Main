"use client";

import LoginButton from "@/components/button/Loginbutton";
import TextInput from "@/components/input/TextInput";
import Birthday from "@/components/birthday/Birthday";
import GenderButton from "@/components/button/GenderButton";
import styles from "@/styles/pages/member/join.module.scss";

export default function join() {
  return (
    <div className={styles.container}>
      <p className={styles.joinTitle}>ToTee Block</p>
      <div className={styles.joinBox}>
        {/* 아이디 입력 */}
        <TextInput>아이디 (E-mail)</TextInput>
        {/* 비밀번호 입력 */}
        <TextInput isPassword>비밀번호</TextInput>
        {/* 비밀번호 확인 입력 */}
        <TextInput isPassword>비밀번호 확인</TextInput>
        {/* 이름 */}
        <TextInput>이름</TextInput>
        {/* 생년월일 */}
        <Birthday></Birthday>
        <GenderButton></GenderButton>
      </div>
      <div className={styles.genderBox}></div>
      {/* 회원가입 버튼 */}
      <LoginButton>회원가입</LoginButton>
    </div>
  );
}
