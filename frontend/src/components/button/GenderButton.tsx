import React from "react";
import styles from "@/styles/components/button/gender-button.module.scss";

interface GenderButtonProps {
  label: string; // 버튼 라벨
  isSelected: boolean; // 버튼이 선택되었는지 여부
  onClick: () => void; // 클릭 이벤트 핸들러
}

const GenderButton: React.FC<GenderButtonProps> = ({
  label,
  isSelected,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={`${styles.GenderButton} ${isSelected ? styles.Selected : ""}`} // 선택 상태에 따라 스타일 적용
      onClick={onClick}
    >
      {label}
    </button>
  );
};

interface GenderSelectorProps {
  selectedGender: string | null; // 선택된 성별 값
  onGenderChange: (gender: string) => void; // 성별 변경 핸들러
}

const GenderSelector: React.FC<GenderSelectorProps> = ({
  selectedGender,
  onGenderChange,
}) => {
  // 화면 표시용 라벨과 Enum 값 매핑
  const genderOptions = [
    { label: "남자", value: "M" },
    { label: "여자", value: "F" },
    { label: "기타", value: "O" },
  ];

  const handleGenderSelect = (genderValue: string) => {
    onGenderChange(genderValue === selectedGender ? "" : genderValue); // 이미 선택된 버튼 클릭 시 해제
  };

  return (
    <div className={styles.GenderBox}>
      <p className={styles.GenderP}>성별</p>
      <div className={styles.GenderSelector}>
        {genderOptions.map(({ label, value }) => (
          <GenderButton
            key={value}
            label={label}
            isSelected={selectedGender === value}
            onClick={() => handleGenderSelect(value)}
          />
        ))}
      </div>
    </div>
  );
};

export default GenderSelector;
