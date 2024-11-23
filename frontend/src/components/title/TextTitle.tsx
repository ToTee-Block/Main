import styles from "@/styles/components/title/text-title.module.scss"; // SCSS 모듈 임포트
import { symlink } from "fs";

interface TextTitle {
  children: React.ReactNode; // 버튼 내용 (필수)
}

const TextTitle: React.FC<TextTitle> = ({ children }) => {
  return <h1 className={styles.title_box}>{children}</h1>;
};

export default TextTitle;
