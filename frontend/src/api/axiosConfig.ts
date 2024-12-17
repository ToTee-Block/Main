import axios from "axios";

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081", // 환경 변수에서 URL 읽기
  withCredentials: true, // 쿠키 전송 허용
});

// 요청 인터셉터 추가 (JWT 토큰 자동 추가)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // JWT 토큰 가져오기
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Authorization 헤더에 JWT 추가
  }
  return config;
});

// BirthDate 타입 정의
interface BirthDate {
  year: string;
  month: string;
  day: string;
}

// 알림 관련 타입 정의
interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Join 메서드 추가
export const join = async (formData: {
  email: string;
  password: string;
  name: string;
  birthDate: BirthDate; // 수정된 타입 적용
  gender: string;
}) => {
  try {
    const response = await apiClient.post("/api/v1/members/join", formData);
    return response.data; // 성공한 경우 응답 데이터 반환
  } catch (error: any) {
    throw error.response?.data || error.message; // 실패한 경우 에러 메시지 반환
  }
};

// Login 메서드 추가
export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post("/api/v1/members/login", credentials);
    return response.data; // 성공한 경우 응답 데이터 반환
  } catch (error: any) {
    throw error.response?.data || error.message; // 실패한 경우 에러 메시지 반환
  }
};

// 권한 부족(403) 상태를 확인하고 처리하는 유틸 함수 추가
export const handleForbiddenError = (error: any): void => {
  if (error.response?.status === 403) {
    console.error("권한이 없습니다. 다시 로그인하세요."); // 서버로부터 권한 오류 메시지 출력
    alert("권한이 없습니다. 다시 로그인해주세요.");
    // 로그인 페이지로 리다이렉트
    window.location.href = "/login";
  } else {
    throw error; // 403 이외의 에러는 그대로 던지기
  }
};

// 사용자 프로필 조회 API 요청 메서드 (403 처리 포함)
export const fetchUserProfile = async () => {
  try {
    const response = await apiClient.get("/api/v1/members/me");
    return response.data;
  } catch (error: any) {
    handleForbiddenError(error); // 403 처리
    throw error.response?.data || error.message; // 다른 에러 처리
  }
};

// 사용자 프로필 수정 API 요청 메서드 (403 처리 포함)
export const updateProfile = async (profileData: {
  email: string;
  name: string;
  birthDate: string; // YYYY-MM-DD 형식
  gender: string;
}) => {
  try {
    const response = await apiClient.patch(
      "/api/v1/members/profile",
      profileData
    );
    return response.data;
  } catch (error: any) {
    handleForbiddenError(error); // 403 처리
    throw error.response?.data || error.message; // 다른 에러 처리
  }
};

// 프로필 이미지 업로드 API 요청 메서드 (403 처리 포함)
export const uploadProfileImage = async (email: string, imageFile: File) => {
  try {
    const formData = new FormData();
    formData.append("profileImg", imageFile);

    const response = await apiClient.post(
      `/api/v1/members/profileImg/${email}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    handleForbiddenError(error); // 403 처리
    throw error.response?.data || error.message; // 다른 에러 처리
  }
};

// 프로필 이미지 삭제 API 요청 메서드 (403 처리 포함)
export const deleteProfileImage = async () => {
  try {
    const response = await apiClient.delete("/api/v1/members/profile-image");
    return response.data;
  } catch (error: any) {
    handleForbiddenError(error); // 403 처리
    throw error.response?.data || error.message; // 다른 에러 처리
  }
};

// 알림 목록 조회 API 요청 메서드
export const fetchNotifications = async () => {
  try {
    const response = await apiClient.get<Notification[]>(
      "/api/v1/notifications"
    );
    return response.data;
  } catch (error: any) {
    handleForbiddenError(error);
    throw error.response?.data || error.message;
  }
};

// 알림 읽음 처리 API 요청 메서드
export const markNotificationAsRead = async (notificationId: number) => {
  try {
    const response = await apiClient.post(
      `/api/v1/notifications/${notificationId}/read`
    );
    return response.data;
  } catch (error: any) {
    handleForbiddenError(error);
    throw error.response?.data || error.message;
  }
};

// WebSocket 연결 설정 (예시)
export const setupNotificationWebSocket = (onMessage: (data: any) => void) => {
  const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/notifications`);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  return ws;
};

export default apiClient;
