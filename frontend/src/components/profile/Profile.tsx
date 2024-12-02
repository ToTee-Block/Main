import React from "react";
import Image from "next/image";
import styles from "@/styles/components/profile/profile.module.scss";

interface ProfileProps {
  profileImg?: string | null; // 프로필 이미지 URL (옵션)
  onUpload?: () => void; // 업로드 버튼 클릭 핸들러
  onDelete?: () => void; // 삭제 버튼 클릭 핸들러
}

const Profile: React.FC<ProfileProps> = ({
  profileImg,
  onUpload,
  onDelete,
}) => {
  return (
    <div className={styles.profileContainer}>
      {/* 프로필 이미지 */}
      <div className={styles.imageWrapper}>
        <Image
          src={profileImg || "/images/base_profile.svg"} // 기본 이미지 제공
          alt="Profile Image"
          width={120}
          height={120}
          className={styles.profileImage} // 이미지 스타일
        />
      </div>

      {/* 업로드 및 삭제 버튼 */}
      <div className={styles.buttonWrapper}>
        <button onClick={onUpload} className={styles.uploadButton}>
          <Image
            src="/images/profile_modify.svg" // 업로드 아이콘
            alt="Upload"
            width={24}
            height={24}
          />
        </button>
        <button onClick={onDelete} className={styles.deleteButton}>
          <Image
            src="/images/profile_delete.svg" // 삭제 아이콘
            alt="Delete"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
};

export default Profile;
