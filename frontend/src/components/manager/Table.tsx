import React from "react";
import styles from "@/styles/components/manager/table.module.scss";
import { Member } from "@/components/manager/Member";

interface TableProps {
  members: Member[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  currentPage: number;
  itemsPerPage?: number;
}

const Table: React.FC<TableProps> = ({
  members,
  onApprove,
  onReject,
  currentPage = 1,
  itemsPerPage = 10,
}) => {
  const getItemNumber = (index: number) => {
    return String((currentPage - 1) * itemsPerPage + index + 1).padStart(
      5,
      "0"
    );
  };

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
            <td>{getItemNumber(index)}</td>
            <td>{member.email}</td>
            <td>{member.username}</td>
            <td>{member.createDate}</td>
            <td className={styles.statusCell}>
              <span className={styles.approveStatus}>승인</span>
              <span className={styles.rejectStatus}>거부</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
