"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import apiClient, { fetchUserProfile, updateProfile } from "@/api/axiosConfig";
import Birthday from "@/components/birthday/Birthday";
import TextInput from "@/components/input/TextInput";
import GenderButton from "@/components/button/GenderButton";
import LoginButton from "@/components/button/Loginbutton";
import ProfileImage from "@/components/profile/ProfileImage";
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

      console.log("Image upload response:", response.data);

      if (response.data.resultCode === "200") {
        const memberResponse = await fetchUserProfile();
        if (memberResponse.resultCode === "200") {
          const { profileImg } = memberResponse.data;
          setProfileImage(
            profileImg ? `http://localhost:8081/file/${profileImg}` : null
          );
        }
        setError(null);
      } else {
        setError(response.data.msg || "Image upload failed");
      }
    } catch (err: any) {
      console.error("Image upload error:", err);
      console.error("Error details:", err.response?.data);
      setError(`이미지 업로드에 실패했습니다: ${err.message}`);
    }
  };

  const handleImageDelete = async () => {
    try {
      const response = await apiClient.delete("/api/v1/members/profile-image");
      console.log("Image delete response:", response.data);
      if (response.data.resultCode === "200") {
        setProfileImage(null);
        setError(null);
      } else {
        throw new Error(response.data.message || "Image deletion failed");
      }
    } catch (err: any) {
      console.error("Image delete error:", err);
      console.error("Error details:", err.response?.data);
      setError(`이미지 삭제에 실패했습니다: ${err.message}`);
    }
  };

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      const response = await fetchUserProfile();
      console.log("Fetch member data response:", response);

      if (response.resultCode === "200") {
        const { email, name, birthDate, gender, profileImg } = response.data;
        setEmail(email);
        setName(name);
        setProfileImage(
          profileImg ? `http://localhost:8081/file/${profileImg}` : null
        );

        if (birthDate) {
          const [year, month, day] = birthDate.split("-");
          setBirthdate({ year, month, day });
        }

        setGender(gender);
        setError(null);
      } else {
        throw new Error(response.msg || "Failed to fetch user data");
      }
    } catch (err: any) {
      console.error("Fetch member data error:", err);
      console.error("Error details:", err.response?.data);
      if (err.response?.status === 403) {
        setError("권한이 없습니다. 로그인 페이지로 이동합니다.");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(`데이터를 불러오는 데 실패했습니다: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!name) {
        setError("이름을 입력해주세요.");
        return;
      }
      if (!birthdate.year || !birthdate.month || !birthdate.day) {
        setError("생년월일을 모두 입력해주세요.");
        return;
      }
      if (!gender) {
        setError("성별을 선택해주세요.");
        return;
      }

      const updateData = {
        email,
        name,
        birthDate: `${birthdate.year}-${birthdate.month}-${birthdate.day}`,
        gender,
      };

      console.log("Updating profile with data:", updateData);
      const response = await updateProfile(updateData);
      console.log("Profile update response:", response);

      if (response.resultCode === "200") {
        const memberResponse = await fetchUserProfile();
        if (memberResponse.resultCode === "200") {
          const { profileImg } = memberResponse.data;
          setProfileImage(
            profileImg ? `http://localhost:8081/file/${profileImg}` : null
          );
        }

        alert("프로필이 성공적으로 업데이트되었습니다!");
        router.push("/members/me");
      } else {
        throw new Error(response.msg || "Profile update failed");
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      console.error("Error details:", err.response?.data);
      if (err.response?.status === 403) {
        setError("권한이 없습니다. 로그인 페이지로 이동합니다.");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(`데이터 업데이트에 실패했습니다: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("JWT token:", localStorage.getItem("token"));
    fetchMemberData();
  }, []);

  const isFormValid = () => {
    return name && birthdate.year && birthdate.month && birthdate.day && gender;
  };

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
        <div className={styles.image}>
          <ProfileImage
            profileImage={profileImage || "/icon/user.svg"}
            onImageUpload={handleImageUpload}
            onImageDelete={handleImageDelete}
          />
        </div>

        <TextInput value={email} isNotModify className={styles.widthInput}>
          이메일
        </TextInput>
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.widthInput}
        >
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
      <div className={styles.buttonBox}>
        <Link href="/" className={styles.cancelButton}>
          나가기
        </Link>
        <LoginButton
          onClick={handleUpdate}
          disabled={!isFormValid()}
          className={styles.loginButton}
        >
          {isLoading ? "처리 중..." : "수정"}
        </LoginButton>
      </div>
    </div>
  );
}
