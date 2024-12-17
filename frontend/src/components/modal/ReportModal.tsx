import React, { useEffect, useState } from "react";
import styles from "@/styles/components/modal/report-modal.module.scss";
import TextInput from "../input/TextInput";

interface YesNoModalProps {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
  setReportActiveNum: (index: Number) => void;
  reportActiveNum: Number;
}

const YesNoModal: React.FC<YesNoModalProps> = ({
  visible,
  onConfirm,
  onClose,
  setReportActiveNum,
  reportActiveNum,
}) => {
  const [reportSelects, setReportSelects] = useState<string[]>([
    "예시1",
    "예시2",
  ]);
  const [reportInput, setReportInput] = useState<string>();

  // useEffect(() => {
  //     const queryParams = new URLSearchParams(window.location.search);
  //     const id = Number(queryParams.get("id")) || 0; //기본값을 0로 설정

  //     const fetchRecentPosts = async () => {
  //       setLoginStatus(await getMe());
  //       try {
  //         const response = await axios.get(
  //           `http://localhost:8081/api/v1/posts/detail/${id}`
  //         );

  //         const resultCode = response.data.resultCode;
  //         const data = response.data.data;
  //         if (resultCode == "200") {
  //           setStacks(data.techStacks);
  //           setValues(data.post);
  //           console.log(data.post);
  //         } else if (resultCode == "400") {
  //           setError("올바른 게시물이 아닙니다.");
  //         } else if (resultCode == "500") {
  //           setError(response.data.msg);
  //         }
  //         setLoading(false);
  //       } catch (error) {
  //         setError("Failed to fetch recent posts.");
  //         setLoading(false);
  //       }
  //     };

  //     fetchRecentPosts();
  //   }, []);

  if (!visible) return null;

  return (
    <div className={styles.Modal}>
      <div className={styles.topBox}>
        <span>신고하기</span>
        <button onClick={onClose}>
          <img src="/icon/x-close.svg" alt="x닫기아이콘" />
        </button>
      </div>
      <ul className={styles.select}>
        {reportSelects.map((content, index) => (
          <li key={index}>
            <div
              className={`${styles.custumCheckBox} ${
                reportActiveNum === index ? styles.active : ""
              }`}
              onClick={() => {
                setReportActiveNum(index);
                console.log(reportSelects[reportActiveNum]);
              }}
            >
              <div className={styles.check}></div>
            </div>
            <span>{content}</span>
          </li>
        ))}
      </ul>
      <div className={styles.actions}>
        <TextInput
          onChange={(e) => {
            setReportInput(e.target.value);
          }}
          placeholder="기타 내용을 입력해주세요.."
        ></TextInput>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default YesNoModal;
