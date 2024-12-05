// components/profile/ProfileImage.tsx
"use client";

import React, { useRef } from "react";
import Image from "next/image";
import styles from "@/styles/components/profile/profile.module.scss";
import basicProfileImage from "/public/icon/basicimage.svg";
import uploadIcon from "/public/icon/basicimage.svg";
import deleteIcon from "/public/icon/trash.svg";

interface ProfileImageProps {
  profileImage: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageDelete: () => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  profileImage,
  onImageUpload,
  onImageDelete,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.profileImageSection}>
      <Image
        src={profileImage || basicProfileImage}
        alt="프로필 이미지"
        width={100}
        height={100}
        className={styles.profileImage}
      />
      <div className={styles.imageControls}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onImageUpload}
          accept="image/*"
          style={{ display: "none" }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className={styles.imageControlButton}
        >
          <Image src={uploadIcon} alt="Upload" width={24} height={24} />
        </button>
        <button onClick={onImageDelete} className={styles.imageControlButton}>
          <Image src={deleteIcon} alt="Delete" width={24} height={24} />
        </button>
      </div>
    </div>
  );
};

export default ProfileImage;
