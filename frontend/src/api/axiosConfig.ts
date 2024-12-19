import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081",
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 400) {
      console.error("Bad Request:", error.response.data);
    }
    return Promise.reject(error);
  }
);

interface BirthDate {
  year: string;
  month: string;
  day: string;
}

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const join = async (formData: {
  email: string;
  password: string;
  name: string;
  birthDate: BirthDate;
  gender: string;
}) => {
  try {
    const response = await apiClient.post("/api/v1/members/join", formData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post("/api/v1/members/login", credentials);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const handleForbiddenError = (error: any): void => {
  if (error.response?.status === 403) {
    console.error("권한이 없습니다. 다시 로그인하세요.");
    alert("권한이 없습니다. 다시 로그인해주세요.");
    window.location.href = "/login";
  } else {
    throw error;
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await apiClient.get("/api/v1/members/me");
    return response.data;
  } catch (error: any) {
    handleForbiddenError(error);
    throw error.response?.data || error.message;
  }
};

export const updateProfile = async (profileData: {
  email: string;
  name: string;
  birthDate: string;
  gender: string;
}) => {
  try {
    const response = await apiClient.patch(
      "/api/v1/members/profile",
      profileData
    );
    return response.data;
  } catch (error: any) {
    handleForbiddenError(error);
    throw error.response?.data || error.message;
  }
};

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
    handleForbiddenError(error);
    throw error.response?.data || error.message;
  }
};

export const deleteProfileImage = async () => {
  try {
    const response = await apiClient.delete("/api/v1/members/profile-image");
    return response.data;
  } catch (error: any) {
    handleForbiddenError(error);
    throw error.response?.data || error.message;
  }
};

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

export const markNotificationAsRead = async (notificationId: number) => {
  try {
    const response = await apiClient.post(
      `/api/v1/notifications/${notificationId}/read`
    );
    return response.status === 200;
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.error("알림을 찾을 수 없습니다:", error.response.data);
    } else {
      console.error("알림을 읽음으로 표시하는 데 실패했습니다:", error.message);
    }
    return false;
  }
};

export const setupNotificationWebSocket = (onMessage: (data: any) => void) => {
  const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/notifications`);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  return ws;
};

export default apiClient;
