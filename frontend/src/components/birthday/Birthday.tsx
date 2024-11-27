import React from "react";
import styles from "@/styles/components/birthday/birthday.module.scss";

interface BirthdayProps {
  value: { year: string; month: string; day: string }; // 생년월일 값 타입을 문자열로 수정
  onChange: (value: { year: string; month: string; day: string }) => void; // 값 변경 이벤트 핸들러
}

const Birthday: React.FC<BirthdayProps> = ({ value, onChange }) => {
  const { year, month, day } = value;

  const years = Array.from({ length: 100 }, (_, i) => 2025 - i); // 연도 배열
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // 월 배열
  const days = Array.from({ length: 31 }, (_, i) => i + 1); // 일 배열

  const handleChange = (key: "year" | "month" | "day", val: string) => {
    const newValue = {
      ...value,
      [key]: val.padStart(2, "0"), // 항상 두 자리 숫자로 저장
    };

    // 데이터 전송용 포맷된 날짜
    const formattedDate = `${newValue.year}-${newValue.month}-${newValue.day}`;
    console.log("Formatted Date to Send to Backend:", formattedDate); // 포맷된 날짜 출력 (확인용)

    onChange(newValue); // 변경된 값 전송
  };

  return (
    <div className={styles.birthdayForm}>
      <p className={styles.birthdayP}>생년월일</p>
      <div className={styles.birthdaySelect}>
        {/* 연도 선택 */}
        <select
          id="birth-year"
          value={year}
          onChange={(e) => handleChange("year", e.target.value)}
          className={styles.select}
        >
          <option value="">연도</option>
          {years.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>

        {/* 월 선택 */}
        <select
          id="birth-month"
          value={month}
          onChange={(e) => handleChange("month", e.target.value)}
          className={styles.select}
        >
          <option value="">월</option>
          {months.map((m) => (
            <option key={m} value={String(m).padStart(2, "0")}>
              {m} {/* 한 자리 숫자로 화면에 표시 */}
            </option>
          ))}
        </select>

        {/* 일 선택 */}
        <select
          id="birth-day"
          value={day}
          onChange={(e) => handleChange("day", e.target.value)}
          className={styles.select}
        >
          <option value="">일</option>
          {days.map((d) => (
            <option key={d} value={String(d).padStart(2, "0")}>
              {d} {/* 한 자리 숫자로 화면에 표시 */}
            </option>
          ))}
        </select>
      </div>
      {/* 에러 메시지 조건부 렌더링 */}
      {(!year || !month || !day) && (
        <p className={styles.errorMessage}>생년월일은 필수 항목입니다.</p>
      )}
    </div>
  );
};

export default Birthday;
