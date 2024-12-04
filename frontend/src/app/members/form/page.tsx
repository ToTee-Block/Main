"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/api/axiosConfig";
import Birthday from "@/components/birthday/Birthday";
import TextInput from "@/components/input/TextInput";
import GenderButton from "@/components/button/GenderButton";
import LoginButton from "@/components/button/Loginbutton";
import ProfileImage from "@/components/profile/profileimage";
import styles from "@/styles/pages/members/form.module.scss";

interface BirthdayType {
  year: string;
  month: string;
  day: string;
}

export default function ProfileForm() {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [birthdate, setBirthdate] = useState<BirthdayType>({
    year: "",
    month: "",
    day: "",
  });
  const [gender, setGender] = useState<string | null>(null);

  const router = useRouter();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("profileImg", file);

      const response = await apiClient.post(
        `/api/v1/members/profileImg/${email}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.resultCode === "200") {
        setProfileImage(`http://localhost:8081/file/${response.data.data}`);
      }
    } catch (err) {
      console.log("이미지 업로드 실패: " + err);
      setError("이미지 업로드에 실패했습니다.");
    }
  };

  const handleImageDelete = async () => {
    try {
      const response = await apiClient.delete("/api/v1/members/profile-image");
      if (response.data.resultCode === "200") {
        setProfileImage(null);
      }
    } catch (err) {
      console.error("이미지 삭제 실패:", err);
      setError("이미지 삭제에 실패했습니다.");
    }
  };

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/v1/members/me");
      console.log("API 응답:", response.data);

      const { email, name, birthDate, gender, profileImg } = response.data.data;
      setEmail(email);
      setName(name);
      setProfileImage(profileImg);

      if (birthDate) {
        const [year, month, day] = birthDate.split("-");
        setBirthdate({ year, month, day });
      }

      setGender(gender);
    } catch (err: any) {
      console.error("데이터 가져오기 오류:", err.response?.data || err.message);
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
        email,
        name,
        birthDate: `${birthdate.year}-${birthdate.month}-${birthdate.day}`,
        gender,
      };

      const response = await apiClient.patch(
        "/api/v1/members/profile",
        updateData
      );

      if (response.data.resultCode === "200") {
        alert("프로필이 성공적으로 업데이트되었습니다!");
        router.push("/");
      }
    } catch (err: any) {
      console.error("데이터 업데이트 오류:", err.response?.data || err.message);
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
    console.log("JWT 토큰:", localStorage.getItem("token"));
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
        <ProfileImage
          profileImage={profileImage || "/icon/user.svg"}
          onImageUpload={handleImageUpload}
          onImageDelete={handleImageDelete}
        />

        <TextInput value={email} isNotModify>
          이메일
        </TextInput>
        <TextInput value={name} onChange={(e) => setName(e.target.value)}>
          이름
        </TextInput>
        <Birthday
          value={birthdate}
          onChange={(newValue) => setBirthdate(newValue)}
        />
        <GenderButton
          selectedGender={gender}
          onGenderChange={(newGender) => setGender(newGender)}
        />
      </div>
      <LoginButton onClick={handleUpdate}>수정</LoginButton>
    </div>
  );
}
