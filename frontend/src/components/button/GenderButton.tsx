// components/GenderButton.tsx
import React, { useState } from "react";
import styles from "@/styles/components/button/gender-button.module.scss"; // SCSS 모듈 임포트

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

const GenderSelector: React.FC = () => {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender === selectedGender ? null : gender); // 이미 선택된 버튼을 클릭하면 해제
  };

  return (
    <div className={styles.GenderBox}>
      <p className={styles.GenderP}>성별</p>
      <div className={styles.GenderSelector}>
        {["남자", "여자", "기타"].map((gender) => (
          <GenderButton
            key={gender}
            label={gender}
            isSelected={selectedGender === gender}
            onClick={() => handleGenderSelect(gender)}
          />
        ))}
      </div>
    </div>
  );
};

export default GenderSelector;
