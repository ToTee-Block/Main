import React from "react";
import styles from "@/styles/components/manager/table.module.scss";

interface Member {
  id: number;
  email: string;
  name: string;
  createdDate: string;
  role: string;
}

interface Mentor {
  id: number;
  createdDate: string;
  email: string;
  name: string;
  profileImg: string | null;
}

interface Post {
  id: number;
  email: string;
  name: string;
  createdDate: string;
  url: string;
}

interface TableProps {
  data: (Member | Mentor | Post)[];
  onApprove?: (mentorId: number, memberId: number) => void;
  onReject?: (mentorId: number, memberId: number) => void;
  onDelete?: (id: number) => void;
  currentPage: number;
  itemsPerPage?: number;
  activeTab: string;
}

const Table: React.FC<TableProps> = ({
  data,
  onApprove,
  onReject,
  onDelete,
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
    const emptyRowsCount = itemsPerPage - data.length;
    return emptyRowsCount > 0
      ? Array(emptyRowsCount)
          .fill(null)
          .map((_, index) => (
            <tr key={`empty-${index}`} className={styles.emptyRow}>
              <td>{getItemNumber(data.length + index)}</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              {activeTab === "members" && <td>&nbsp;</td>}
              {activeTab === "posts" && <td>&nbsp;</td>}
              <td>
                <div className={styles.statusCell}>
                  {activeTab === "posts" ? (
                    <button className={styles.deleteStatus}>삭제</button>
                  ) : activeTab === "mentors" ? (
                    <>
                      <button className={styles.approveStatus}>승인</button>
                      <button className={styles.rejectStatus}>거부</button>
                    </>
                  ) : (
                    <button className={styles.rejectStatus}>삭제</button>
                  )}
                </div>
              </td>
            </tr>
          ))
      : null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table} data-tab={activeTab}>
        <thead>
          <tr>
            <th>No</th>
            <th>Id</th>
            <th>Name</th>
            <th>create DATE</th>
            {activeTab === "members" && <th>TYPE</th>}
            {activeTab === "posts" && <th>URL</th>}
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (
              <tr key={item.id}>
                <td>{getItemNumber(index)}</td>
                <td>{item.email}</td>
                <td>{item.name}</td>
                <td>{formatDate(item.createdDate)}</td>
                {activeTab === "members" && <td>{(item as Member).role}</td>}
                {activeTab === "posts" && <td>{(item as Post).url}</td>}
                <td>
                  <div className={styles.statusCell}>
                    {activeTab === "posts" ? (
                      <button
                        className={styles.deleteStatus}
                        onClick={() => onDelete?.(item.id)}
                      >
                        삭제
                      </button>
                    ) : activeTab === "mentors" ? (
                      <>
                        <button
                          className={styles.approveStatus}
                          onClick={() => onApprove?.(item.id, item.id)}
                        >
                          승인
                        </button>
                        <button
                          className={styles.rejectStatus}
                          onClick={() => onReject?.(item.id, item.id)}
                        >
                          거부
                        </button>
                      </>
                    ) : (
                      <button
                        className={styles.rejectStatus}
                        onClick={() => onDelete?.(item.id)}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          {renderEmptyRows()}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
