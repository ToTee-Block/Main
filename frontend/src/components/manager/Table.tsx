import React from "react";
import styles from "@/styles/components/manager/table.module.scss";
import Link from "next/link";

interface TableItem {
  id: number;
  email: string;
  name: string;
  createdDate: string;
  url?: string;
  role?: string;
}

interface ReportItem {
  reportId: number;
  reporterName: string;
  target: {
    targetId: number;
    url: string;
    authorName: string;
    subject: string;
  };
  reason: string;
  status: string;
  createdDate: string;
}

interface TableProps {
  data: (TableItem | ReportItem)[] | undefined;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const isReportItem = (item: TableItem | ReportItem): item is ReportItem => {
    return "reportId" in item;
  };

  const renderStatusButtons = (id: number) => {
    if (activeTab === "mentors" || activeTab === "reports") {
      return (
        <div className={styles.statusCell}>
          <button
            className={styles.approveStatus}
            onClick={() => onApprove?.(id)}
          >
            {activeTab === "mentors" ? "승인" : "글 삭제"}
          </button>
          <button
            className={styles.rejectStatus}
            onClick={() => onReject?.(id)}
          >
            {activeTab === "mentors" ? "거부" : "반려"}
          </button>
        </div>
      );
    } else {
      return (
        <div className={styles.statusCell}>
          <button
            className={styles.rejectStatus}
            onClick={() => onDelete?.(id)}
          >
            삭제
          </button>
        </div>
      );
    }
  };

  const renderTableRow = (item: TableItem | ReportItem, index: number) => {
    if (isReportItem(item)) {
      return (
        <tr key={item.reportId}>
          <td>{getItemNumber(index)}</td>
          <td>{item.reporterName}</td>
          <td>{item.target.authorName}</td>
          <td>
            <Link
              href={`/post/detail?id=${item.target.targetId}`}
              className={styles.linkText}
            >
              {item.target.subject}
            </Link>
          </td>
          <td>{item.reason}</td>
          <td>{item.status}</td>
          <td>{formatDate(item.createdDate)}</td>
          <td>{renderStatusButtons(item.reportId)}</td>
        </tr>
      );
    } else {
      return (
        <tr key={item.id}>
          <td>{getItemNumber(index)}</td>
          <td>{item.email}</td>
          <td>{item.name}</td>
          <td>{formatDate(item.createdDate)}</td>
          {activeTab === "members" && <td>{item.role}</td>}
          {activeTab === "posts" && (
            <td>
              {item.url ? (
                <Link
                  href={`/post/detail?id=${item.id}`}
                  className={styles.linkText}
                >
                  {item.url}
                </Link>
              ) : (
                "N/A"
              )}
            </td>
          )}
          <td>{renderStatusButtons(item.id)}</td>
        </tr>
      );
    }
  };

  const renderEmptyRows = () => {
    if (!data) return null;
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
              {activeTab === "reports" && (
                <>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </>
              )}
              <td>
                <div className={styles.statusCell}>
                  {(activeTab === "mentors" || activeTab === "reports") && (
                    <>
                      <button className={styles.approveStatus}>
                        {activeTab === "mentors" ? "승인" : "글 삭제"}
                      </button>
                      <button className={styles.rejectStatus}>
                        {activeTab === "mentors" ? "거부" : "반려"}
                      </button>
                    </>
                  )}
                  {activeTab !== "mentors" && activeTab !== "reports" && (
                    <button className={styles.rejectStatus}>삭제</button>
                  )}
                </div>
              </td>
            </tr>
          ))
      : null;
  };

  if (!data) {
    return <div>데이터를 불러오는 중...</div>;
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table} data-tab={activeTab}>
        <thead>
          <tr>
            <th>No</th>
            {activeTab === "reports" ? (
              <>
                <th>신고자</th>
                <th>작성자</th>
                <th>제목</th>
                <th>사유</th>
                <th>상태</th>
                <th>신고일</th>
              </>
            ) : (
              <>
                <th>Id</th>
                <th>Name</th>
                <th>create DATE</th>
                {activeTab === "members" && <th>TYPE</th>}
                {activeTab === "posts" && <th>URL</th>}
              </>
            )}
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => renderTableRow(item, index))}
          {renderEmptyRows()}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
