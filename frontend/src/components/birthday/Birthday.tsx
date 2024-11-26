import React, { useState, useEffect } from "react";
import styles from "@/styles/components/birthday/birthday.module.scss";

interface BirthdayProps {}

const Birthday: React.FC<BirthdayProps> = () => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [error, setError] = useState(false);

  const years = Array.from({ length: 100 }, (_, i) => 2025 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // 입력값 유효성 확인
  useEffect(() => {
    if (year && month && day) {
      setError(false); // 모든 값이 입력되었으면 에러 숨기기
    } else {
      setError(true); // 하나라도 비어 있으면 에러 표시
    }
  }, [year, month, day]);

  return (
    <div className={styles.birthdayForm}>
      <p className={styles.birthdayP}>생년월일</p>
      <div className={styles.birthdaySelect}>
        {/* 연도 선택 */}
        <select
          id="birth-year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className={styles.select}
        >
          <option value="">연도</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* 월 선택 */}
        <select
          id="birth-month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className={styles.select}
        >
          <option value="">월</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m.toString().padStart(2, "0")}
            </option>
          ))}
        </select>

        {/* 일 선택 */}
        <select
          id="birth-day"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className={styles.select}
        >
          <option value="">일</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
      </div>
      {/* 에러 메시지 조건부 렌더링 */}
      {error && (
        <p className={styles.errorMessage}>생년월일은 필수 항목입니다.</p>
      )}
    </div>
  );
};

export default Birthday;
