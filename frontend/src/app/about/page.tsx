'use client'
import styles from '@/styles/pages/about.module.scss';
import Image from 'next/image';


export default function About() {
  const features = [
    {
      number: "1",
      title: "IT 전문가 매칭",
    },
    {
      number: "2",
      title: "맞춤형 학습 가이드",
    },
    {
      number: "3",
      title: "Q&A 게시판 활성화",
    },
    {
      number: "4",
      title: "실시간 채팅",
    },
    {
      number: "5",
      title: "통합 커뮤니티"
    }
  ];

  return (
    <div className={styles.about_page}>
      <section className={styles.mockup_section}>
        <div className={styles.mockup_container}>
          <div className={styles.mockup_image}>
            <Image src="/images/macmockup.png" alt="Site Preview"  width={500}  height={400} />
          </div>
          <div className={styles.text_animation_container}>
            <div className={styles.animated_text_slide}>
              <div className={styles.text_item}>
              <h3>멘토매칭은 토티블럭</h3>
            </div>
            <div className={styles.text_item}>
              <h3>개발소통은 토티블럭</h3>
            </div>
            <div className={styles.text_item}>
              <h3>개발성장은 토티블럭</h3>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className={styles.structure_section}>
        <div className={styles.section_title}>
          <h1>커리어의 가치를 더하는 연결의 시작</h1>
          <p className={styles.subtitle}>개발부터 디자인까지, 목표에 맞춘 솔루션을 제안합니다.</p>
        </div>

        <div className={styles.mentor_mentee_structure}>
          <div className={styles.mentor_mentee}>
            <div className={styles.mentor_mentee}>
              <Image src="/images/mentormentee.png" alt="멘토 멘티 구조"  width={700} height={500} />
            </div>
          </div>
        </div>
      </section>
      
      <section className={styles.feature_section}>
        <div className={styles.company_structure} style={{ backgroundImage: "url('/images/company.png')", backgroundSize: "cover" }}>
          <div className={styles.overlay_content}>
            <div className={styles.section_title}>
              <h1>개발자 성장의 모든 것</h1>
              <p className={styles.subtitle}>전문가가 제안하는 최적의 성장 플랫폼을 경험해보세요.</p>
            </div>

            <div className={styles.feature_list}>
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={styles.feature_item}
                >
                  <div className={styles.number}>{feature.number}</div>
                  <div className={styles.feature_content}>
                    <h3>{feature.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}