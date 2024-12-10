import React from "react";
import styles from "@/styles/components/manager/table.module.scss";
import { Member } from "@/components/manager/Member";

interface TableProps {
  members: Member[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

const Table: React.FC<TableProps> = ({ members, onApprove, onReject }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>No</th>
          <th>Id</th>
          <th>Name</th>
          <th>create DATE</th>
          <th>STATUS</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member, index) => (
          <tr key={member.id}>
            <td>{String(index + 1).padStart(5, "0")}</td>
            <td>{member.email}</td>
            <td>{member.username}</td>
            <td>{member.createDate}</td>
            <td className={styles.buttonGroup}>
              <button
                className={styles.approveButton}
                onClick={() => onApprove(member.id)}
              >
                승인
              </button>
              <button
                className={styles.rejectButton}
                onClick={() => onReject(member.id)}
              >
                거부
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
