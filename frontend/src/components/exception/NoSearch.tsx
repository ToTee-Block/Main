import styles from "@/styles/components/exception/no-search.module.scss";

interface NoSearchProps {
  onClick?: () => void;
  disabled?: boolean;
}

const NoSearch: React.FC<NoSearchProps> = ({ disabled = false }) => {
  return (
    <div className={`${styles.noSearch} ${disabled ? styles.disabled : ""}`}>
      <span>검색 결과가 없습니다.</span>
    </div>
  );
};

export default NoSearch;
