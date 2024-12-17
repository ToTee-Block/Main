"use client";

import React, { useState, useEffect } from "react";
import styles from "@/styles/components/form/comment-form.module.scss"; // SCSS 모듈 임포트

interface CommentFormProps {
  disabled?: boolean;
  myProfileImg?: string;
  comment: string;
  setComment: (content: string) => void;
  postComment: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  disabled,
  myProfileImg,
  comment,
  setComment,
  postComment,
}) => {
  return (
    <div className={styles.commentForm}>
      <div>
        <div className={styles.profileImgBox}>
          <img
            src={
              disabled && myProfileImg !== ""
                ? myProfileImg
                : "/images/Rectangle.png"
            }
            alt={
              disabled ? "로그인된 사용자 프로필 이미지" : "기본 프로필 이미지"
            }
          />
        </div>
        <textarea
          disabled={!disabled}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
          placeholder={
            !disabled ? "로그인이 필요합니다." : "댓글을 작성해주세요."
          }
        ></textarea>
      </div>
      {!disabled ? <></> : <button onClick={postComment}>작성</button>}
    </div>
  );
};

export default CommentForm;
