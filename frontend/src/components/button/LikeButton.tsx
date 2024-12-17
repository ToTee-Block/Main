import React from "react";
import styles from "@/styles/components/button/like-button.module.scss"; // SCSS 모듈 임포트

interface LikeButtonProps {
  likes: Number;
  postLike: () => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ likes, postLike }) => {
  return (
    <button onClick={() => postLike()} className={styles.likeBtn}>
      <img src="/icon/smile.svg" alt="스마일 아이콘" />
      좋아요 {likes}
    </button>
  );
};

export default LikeButton;
