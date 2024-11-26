import axios from "axios";

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000", // 환경 변수에서 URL 읽기
  withCredentials: true, // 쿠키 전송 허용
});

// BirthDate 타입 정의
interface BirthDate {
  year: string;
  month: string;
  day: string;
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

export default apiClient;
