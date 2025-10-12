import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Spring Boot 기본 포트
  withCredentials: true, // 쿠키 자동 전송
});

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};
