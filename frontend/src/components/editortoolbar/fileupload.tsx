"use client";

import { useRef, useState } from "react";
import apiClient from "@/api/axiosConfig";
import styles from "@/styles/components/editortoolbar/fileupload.module.scss";
import Image from "next/image";

interface FileUploadProps {
  id: Number;
  thumbNail: string;
  setThumbNail: (url: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ thumbNail, setThumbNail }) => {
  const [thisThumbNail, setThisThumbNail] = useState<string | null>(thumbNail);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append("image", file);

          const response = await apiClient.patch(
            "http://localhost:8081/api/v1/posts/image",
            formData // FormData 객체를 전달
          );

          const resultCode = response.data.resultCode;
          const msg = response.data.msg;
          const data = response.data.data;
          if (resultCode == "200") {
            setThumbNail(data);
            setThisThumbNail(data);

            console.log("서버에서 받은 이미지 URL:", data);
          } else {
            console.log(msg);
          }
        } catch (err) {
          console.log("파일 업로드 실패:", err);
        }
      }
    }
  };

  return (
    <div className={styles.uploadWrapper}>
      <div className={styles.imgBox}>
        <img
          src={
            thumbNail
              ? `http://localhost:8081/file/${thumbNail}`
              : "/images/Rectangle.png"
          }
          alt="썸네일 이미지"
        />
      </div>
      <div className={styles.uploadContent} onClick={handleClick}>
        <div className={styles.uploadIcon}>
          <Image
            src="/icon/upload.svg"
            alt="Upload"
            width={24}
            height={24}
            className={styles.icon}
          />
        </div>
        <span className={styles.browseFiles}>Thumbnail Upload</span>
        <input
          type="file"
          ref={fileInputRef}
          className={styles.hiddenInput}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default FileUpload;
