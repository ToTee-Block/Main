import React, { useState, useEffect } from "react";
import apiClient from "@/api/axiosConfig";
import styles from "@/styles/components/mentoring/mentoring.module.scss";
import { AxiosError } from "axios";

interface User {
  id: number;
  email: string;
  name: string;
  birthDate: string;
  gender: string;
  role: "USER" | "MENTOR";
  profileImg: string | null;
  createdDate: string;
  modifiedDate: string;
}

interface MatchingDTO {
  matchingId: number;
  approve: boolean;
  name: string;
  mentorId: number;
  menteeId: number;
}

const Mentoring: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mentorData, setMentorData] = useState<MatchingDTO[]>([]);
  const [menteeRequests, setMenteeRequests] = useState<MatchingDTO[]>([]);
  const [inProgressMentorings, setInProgressMentorings] = useState<
    MatchingDTO[]
  >([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await apiClient.get("/api/v1/members/me");
      if (response.data.resultCode === "200") {
        setUser(response.data.data);
        if (response.data.data.role === "MENTOR") {
          await Promise.all([fetchMentorData(), fetchInProgressMentorings()]);
        } else {
          await fetchMenteeData();
        }
      }
    } catch (error) {
      console.error("사용자 데이터 조회 실패:", error);
    }
  };

  const fetchMentorData = async () => {
    try {
      const response = await apiClient.get(
        "/api/v1/mentors/myMentoring/requests"
      );
      if (response.data.resultCode === "200") {
        setMenteeRequests(response.data.data);
      }
    } catch (error) {
      console.error("멘토 데이터 조회 실패:", error);
    }
  };

  const fetchInProgressMentorings = async () => {
    try {
      const response = await apiClient.get(
        "/api/v1/mentors/myMentoring/inProgress"
      );
      if (response.data.resultCode === "200") {
        setInProgressMentorings(response.data.data);
      }
    } catch (error) {
      console.error("진행 중인 멘토링 조회 실패:", error);
    }
  };

  const fetchMenteeData = async () => {
    try {
      const response = await apiClient.get(
        "/api/v1/members/myMentorings/request"
      );
      if (response.data.resultCode === "200") {
        setMentorData(response.data.data);
      }
    } catch (error) {
      console.error("멘티 데이터 조회 실패:", error);
    }
  };

  if (!user) return <div>로딩 중...</div>;

  return (
    <div className={styles.mentoringContainer}>
      {user.role === "MENTOR" ? (
        <MentorView
          requests={menteeRequests}
          inProgress={inProgressMentorings}
          refreshData={fetchMentorData}
          refreshInProgress={fetchInProgressMentorings}
          userName={user.name}
        />
      ) : (
        <MenteeView
          data={mentorData}
          refreshData={fetchMenteeData}
          userName={user.name}
        />
      )}
    </div>
  );
};

const MentorView: React.FC<{
  requests: MatchingDTO[];
  inProgress: MatchingDTO[];
  refreshData: () => void;
  refreshInProgress: () => void;
  userName: string;
}> = ({ requests, inProgress, refreshData, refreshInProgress, userName }) => {
  const handleApprove = async (matchingId: number) => {
    try {
      const response = await apiClient.post(
        "/api/v1/mentors/myMentoring/approve",
        {
          matchingId: matchingId,
          approve: true,
        }
      );
      if (response.data.resultCode === "200") {
        alert("멘토링 요청을 승인했습니다.");
        refreshData();
        refreshInProgress();
      } else {
        alert(response.data.msg || "승인 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("멘토링 승인 실패:", error);
      alert("승인 처리 중 오류가 발생했습니다.");
    }
  };

  const handleReject = async (matchingId: number) => {
    try {
      const response = await apiClient.post(
        "/api/v1/mentors/myMentoring/approve",
        {
          matchingId: matchingId,
          approve: false,
        }
      );
      if (response.data.resultCode === "200") {
        alert("멘토링 요청을 거절했습니다.");
        refreshData();
        refreshInProgress();
      } else {
        alert(response.data.msg || "거절 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("멘토링 거절 실패:", error);
      alert("거절 처리 중 오류가 발생했습니다.");
    }
  };

  const handleDisconnect = async (mentorId: number, menteeId: number) => {
    try {
      const response = await apiClient.delete(
        "/api/v1/mentors/myMentoring/disconnect",
        {
          params: { mentorId, menteeId },
        }
      );
      if (response.data.resultCode === "200") {
        alert("멘토링 연결이 끊어졌습니다.");
        refreshData();
        refreshInProgress();
      } else {
        console.error("연결 끊기 실패 응답:", response.data);
        alert(response.data.msg || "연결 끊기 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("멘토링 연결 끊기 실패:", error);
      if (error instanceof AxiosError && error.response) {
        console.error("에러 응답:", error.response.data);
      }
      alert(
        "연결 끊기 처리 중 오류가 발생했습니다. 자세한 내용은 콘솔을 확인해주세요."
      );
    }
  };

  const handleChatRequest = async (mentee: MatchingDTO) => {
    try {
      const response = await apiClient.post("/chat/rooms", {
        name: `Mentoring Chat: ${userName} with ${mentee.name}`,
        menteeId: mentee.menteeId,
        mentorId: mentee.mentorId,
      });
      if (response.data.resultCode === "200") {
        alert("채팅방이 생성되었습니다. 채팅을 시작합니다.");
        // 여기에 채팅 인터페이스로 이동하는 로직을 추가할 수 있습니다.
      } else {
        throw new Error(response.data.msg || "채팅방 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
      alert("채팅방 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.mentoringContent}>
      <div className={styles.mentorSection}>
        <h4>멘토링 신청 목록</h4>
        <div className={styles.requestList}>
          {requests
            .filter((request) => !request.approve)
            .map((request) => (
              <div key={request.matchingId} className={styles.requestItem}>
                <span>{request.name}</span>
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.acceptButton}
                    onClick={() => handleApprove(request.matchingId)}
                  >
                    수락
                  </button>
                  <button
                    className={styles.rejectButton}
                    onClick={() => handleReject(request.matchingId)}
                  >
                    거절
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className={styles.mentorSection}>
        <h4>진행 중인 멘토링</h4>
        <div className={styles.requestList}>
          {inProgress.map((mentee) => (
            <div key={mentee.matchingId} className={styles.requestItem}>
              <span>{mentee.name}</span>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.chatButton}
                  onClick={() => handleChatRequest(mentee)}
                >
                  채팅신청
                </button>
                <button
                  className={styles.disconnectButton}
                  onClick={() =>
                    handleDisconnect(mentee.mentorId, mentee.menteeId)
                  }
                >
                  연결 끊기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MenteeView: React.FC<{
  data: MatchingDTO[];
  refreshData: () => void;
  userName: string;
}> = ({ data, refreshData, userName }) => {
  const handleChatRequest = async (mentor: MatchingDTO) => {
    try {
      const response = await apiClient.post("/chat/rooms", {
        name: `${mentor.name} with ${userName}`,
        menteeId: mentor.menteeId,
        mentorId: mentor.mentorId,
      });
      if (response.data.resultCode === "200") {
        alert("채팅방이 생성되었습니다. 채팅을 시작합니다.");
        // 여기에 채팅 인터페이스로 이동하는 로직을 추가할 수 있습니다.
      } else {
        throw new Error(response.data.msg || "채팅방 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
      alert("채팅방 생성 중 오류가 발생했습니다.");
    }
  };

  const handleDisconnect = async (mentorId: number, menteeId: number) => {
    try {
      const response = await apiClient.delete(
        "/api/v1/mentors/myMentoring/disconnect",
        {
          params: { mentorId, menteeId },
        }
      );
      if (response.data.resultCode === "200") {
        alert("멘토링 연결이 끊어졌습니다.");
        refreshData();
      } else {
        console.error("연결 끊기 실패 응답:", response.data);
        alert(response.data.msg || "연결 끊기 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("멘토링 연결 끊기 실패:", error);
      if (error instanceof AxiosError && error.response) {
        console.error("에러 응답:", error.response.data);
      }
      alert(
        "연결 끊기 처리 중 오류가 발생했습니다. 자세한 내용은 콘솔을 확인해주세요."
      );
    }
  };

  return (
    <div className={styles.mentoringContent}>
      <div className={styles.menteeSection}>
        <h4>멘토 목록</h4>
        <div className={styles.requestList}>
          {data.map((mentor) => (
            <div key={mentor.matchingId} className={styles.requestItem}>
              <span>{mentor.name}</span>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.chatButton}
                  onClick={() => handleChatRequest(mentor)}
                >
                  채팅신청
                </button>
                <button
                  className={styles.disconnectButton}
                  onClick={() =>
                    handleDisconnect(mentor.mentorId, mentor.menteeId)
                  }
                >
                  연결 끊기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mentoring;
