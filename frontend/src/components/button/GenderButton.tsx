import React, { useState, useEffect } from "react";
import styles from "@/styles/components/button/gender-button.module.scss";

interface GenderButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const GenderButton: React.FC<GenderButtonProps> = ({
  label,
  isSelected,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={`${styles.GenderButton} ${isSelected ? styles.Selected : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

interface GenderSelectorProps {
  selectedGender: string | null;
  onGenderChange: (gender: string) => void;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({
  selectedGender,
  onGenderChange,
}) => {
  const [showError, setShowError] = useState(true);

  const genderOptions = [
    { label: "남자", value: "M" },
    { label: "여자", value: "F" },
    { label: "기타", value: "O" },
  ];

  const handleGenderSelect = (genderValue: string) => {
    onGenderChange(genderValue === selectedGender ? "" : genderValue);
  };

  useEffect(() => {
    setShowError(!selectedGender);
  }, [selectedGender]);

  return (
    <div className={styles.GenderBox}>
      <p className={styles.GenderP}>성별</p>
      <div
        className={`${styles.GenderSelector} ${
          showError ? styles.errorInput : ""
        }`}
      >
        {genderOptions.map(({ label, value }) => (
          <GenderButton
            key={value}
            label={label}
            isSelected={selectedGender === value}
            onClick={() => handleGenderSelect(value)}
          />
        ))}
      </div>
      {showError && <p className={styles.errorMessage}>성별을 선택해주세요.</p>}
    </div>
  );
};

export default GenderSelector;
