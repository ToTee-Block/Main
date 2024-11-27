'use client'

import styles from '@/styles/pages/mentor-detail.module.scss';
import Image from 'next/image';

export default function MentorDetail() {
  const skills = ["Text", "Text", "Text"];
  const mentorHistory = [
    "멘토님이 친절하시고 잘 가르쳐 주세요 ~!",
    "멘토님이 친절하시고 잘 가르쳐 주세요 ~!",
    "멘토님이 친절하시고 잘 가르쳐 주세요 ~!",
    "멘토님이 친절하시고 잘 가르쳐 주세요 ~!",
    "멘토님이 친절하시고 잘 가르쳐 주세요 ~!",
    "멘토님이 친절하시고 잘 가르쳐 주세요 ~!",
    "멘토님이 친절하시고 잘 가르쳐 주세요 ~!",
    "멘토님이 친절하시고 잘 가르쳐 주세요 ~!"
  ];

  return (
    <div className={styles.mentorDetail}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>Mentor profile</h1>
        <div className={styles.divider} />
      </div>

      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <div className={styles.starIcon}>
            <img
              src="/icon/star1.svg"
              alt="star icon"
            />
            <span className={styles.starNumber}>01</span>
          </div>
          <div className={styles.image} />
          <div className={styles.info}>
            <span className={styles.name}>박승수</span>
            <span className={styles.role}>Full-Stack 멘토</span>
          </div>
          <div className={styles.status}>
            <span className={styles.statusText}>Mentor 신청</span>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>HELLO EVERYONE</h1>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>자기소개</h2>
          <p className={styles.description}>
            With support text underneath to add more detailWith support text underneath to add more detail
            With support text underneath to add more detailWith support text underneath to add more detail
            With support text underneath to add more detailWith support text underneath to add more detail
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>기술 스택</h2>
          <div className={styles.skillTags}>
            {skills.map((skill, index) => (
              <span key={index} className={styles.tag}>{skill}</span>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>포트폴리오 주소</h2>
          <a href="#" className={styles.portfolioLink}>http://localhost/github</a>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>멘티 후기's</h2>
          <div className={styles.history}>
            {mentorHistory.map((history, index) => (
              <div key={index} className={styles.historyItem}>
                {history}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.submitButton}>
          <span className={styles.buttonText}>수정</span>
        </div>
      </div>
    </div>
  );
}