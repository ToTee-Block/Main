import React from "react";
import styles from "@/styles/components/birthday/birthday.module.scss";

interface BirthdayProps {
  value: { year: number; month: number; day: number }; // 생년월일 값 타입을 숫자로 수정
  onChange: (value: { year: number; month: number; day: number }) => void; // 값 변경 이벤트 핸들러
}

const Birthday: React.FC<BirthdayProps> = ({ value, onChange }) => {
  const { year, month, day } = value;

  const years = Array.from({ length: 100 }, (_, i) => 2025 - i); // 연도 배열
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // 월 배열
  const days = Array.from({ length: 31 }, (_, i) => i + 1); // 일 배열

  // 생년월일 포맷을 'yyyy-MM-dd'로 맞추는 함수
  const formatDate = (year: number, month: number, day: number): string => {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  };

  const handleChange = (key: "year" | "month" | "day", val: string) => {
    const newValue = { ...value, [key]: Number(val) };
    // 값이 변경될 때마다 생년월일 포맷을 맞춰서 전달
    const formattedDate = formatDate(
      newValue.year,
      newValue.month,
      newValue.day
    );
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
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* 월 선택 */}
        <select
          id="birth-month"
          value={month} // 내부에서 0이 빠진 값으로 선택되며, 값은 실제로 1~12로 처리됨
          onChange={(e) => handleChange("month", e.target.value)}
          className={styles.select}
        >
          <option value="">월</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m} {/* 화면에 0이 없는 월 표시 */}
            </option>
          ))}
        </select>

        {/* 일 선택 */}
        <select
          id="birth-day"
          value={day} // 내부에서 0이 빠진 값으로 선택되며, 값은 실제로 1~31로 처리됨
          onChange={(e) => handleChange("day", e.target.value)}
          className={styles.select}
        >
          <option value="">일</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d} {/* 화면에 0이 없는 일 표시 */}
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
