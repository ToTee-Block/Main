import React from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/components/button/modify-button.module.scss"; // SCSS 모듈 임포트

interface ModifyButtonProps {
  type: string;
  id: Number;
}

const ModifyButton: React.FC<ModifyButtonProps> = ({ type, id }) => {
  const router = useRouter();
  const handleSubmit = () => {
    sessionStorage.setItem("postingType", type); // type: "posts" or "qnas"
    sessionStorage.setItem("id", id + "");
    router.push("/editor");
  };

  return (
    <button
      onClick={() => {
        handleSubmit();
        console.log("수정하기");
      }}
      className={styles.modifytBtn}
    >
      수정하기
    </button>
  );
};

export default ModifyButton;
