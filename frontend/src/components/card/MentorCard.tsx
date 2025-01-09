import Link from "next/link";
import Image from "next/image";
import React from "react";
import styles from "@/styles/components/card/mentor-card.module.scss";

interface MentorCardProps {
  href: string;
  name: string;
  type: string;
  description: string;
  imageUrl: string;
}

const MentorCard: React.FC<MentorCardProps> = ({
  href,
  name,
  type,
  description,
  imageUrl,
}) => {
  return (
    <Link href={href} className={styles.MentorBox}>
      <div className={styles.MentorCard}>
        <Image
          src={imageUrl}
          alt={name}
          width={168}
          height={175}
          onError={(e) => {
            e.currentTarget.src = "/icon/user.svg";
          }}
        />
        <div className={styles.content}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.type}>{type}</p>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default MentorCard;
