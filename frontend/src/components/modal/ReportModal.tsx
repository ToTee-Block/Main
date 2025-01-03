import React, { useEffect, useState } from "react";
import axios from "axios";
import apiClient, { fetchUserProfile } from "@/api/axiosConfig";
import styles from "@/styles/components/modal/report-modal.module.scss";
import TextInput from "../input/TextInput";

interface YesNoModalProps {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
  setReportActiveNum: (index: Number) => void;
  reportActiveNum: Number;
  setReportTextInput: (value: string) => void;
  reportTextInput: string;
}

const YesNoModal: React.FC<YesNoModalProps> = ({
  visible,
  onConfirm,
  onClose,
  setReportActiveNum,
  reportActiveNum,
  setReportTextInput,
  reportTextInput,
}) => {
  const [reportSelects, setReportSelects] = useState<string[]>();
  const [loginStatus, setLoginStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const checkLogin = async () => {
    const response = await fetchUserProfile();
    console.log(response);
    if (response.resultCode == "200") {
      setLoginStatus(true);
      return;
    }
    setLoginStatus(false);
  };

  useEffect(() => {
    const fetchReports = async () => {
      checkLogin();

      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/reports`
        );

        const resultCode = response.data.resultCode;
        const data = response.data.data;
        if (resultCode == "200") {
          setReportSelects(data);
          console.log(data);
        } else {
          alert("정보를 가져오지 못했습니다.");
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch recent posts.");
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

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
        {Object.entries(reportSelects).map(([key, selection]) => (
          <li key={key}>
            <div
              className={`${styles.custumCheckBox} ${
                reportActiveNum === Number(key) ? styles.active : ""
              }`}
              onClick={() => {
                setReportActiveNum(Number(key));
                console.log(`${key}, ${selection}`);
              }}
            >
              <div className={styles.check}></div>
            </div>
            <span>{selection}</span>
          </li>
        ))}
      </ul>
      <div className={styles.actions}>
        <TextInput
          value={reportTextInput}
          onChange={(e) => {
            setReportTextInput(e.target.value);
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
