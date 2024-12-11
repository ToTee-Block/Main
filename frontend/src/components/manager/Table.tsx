import React from "react";
import styles from "@/styles/components/manager/table.module.scss";
import { Member } from "@/components/manager/Member";

interface TableProps {
  members: Member[];
  onApprove?: (id: number) => void;
  onReject: (id: number) => void;
  currentPage: number;
  itemsPerPage?: number;
  activeTab: string;
}

const Table: React.FC<TableProps> = ({
  members,
  onApprove,
  onReject,
  currentPage = 1,
  itemsPerPage = 10,
  activeTab,
}) => {
  const getItemNumber = (index: number) => {
    return String((currentPage - 1) * itemsPerPage + index + 1).padStart(
      5,
      "0"
    );
  };

  const renderEmptyRows = () => {
    const emptyRowsCount = itemsPerPage - members.length;
    return emptyRowsCount > 0
      ? Array(emptyRowsCount)
          .fill(null)
          .map((_, index) => (
            <tr key={`empty-${index}`} className={styles.emptyRow}>
              <td>{getItemNumber(members.length + index)}</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              {activeTab !== "memberApproval" && <td>&nbsp;</td>}
              <td>
                <div className={styles.statusCell}>
                  {activeTab === "memberApproval" ? (
                    <>
                      <button className={styles.approveStatus}>승인</button>
                      <button className={styles.rejectStatus}>거부</button>
                    </>
                  ) : (
                    <>
                      <button className={styles.approveStatus}>수정</button>
                      <button className={styles.rejectStatus}>삭제</button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))
      : null;
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>No</th>
            <th>Id</th>
            <th>Name</th>
            <th>create DATE</th>
            {activeTab !== "memberApproval" && <th>TYPE</th>}
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
              {activeTab !== "memberApproval" && <td>Member</td>}
              <td>
                <div className={styles.statusCell}>
                  {activeTab === "memberApproval" ? (
                    <>
                      <button
                        className={styles.approveStatus}
                        onClick={() => onApprove?.(member.id)}
                      >
                        승인
                      </button>
                      <button
                        className={styles.rejectStatus}
                        onClick={() => onReject(member.id)}
                      >
                        거부
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={styles.approveStatus}
                        onClick={() => onApprove?.(member.id)}
                      >
                        수정
                      </button>
                      <button
                        className={styles.rejectStatus}
                        onClick={() => onReject(member.id)}
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {renderEmptyRows()}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
