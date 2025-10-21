//로그인 및 회원가입 api

import api from "./axios";
import qs from "qs";

//로그인 요청
export const postLogin = async ({ username, password }) => {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  const response = await api.post("/login", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
};

// 내 정보 조회 (토큰 기반)
export const getUserInfo = async () => {
  const res = await api.get("/me");
  return res.data;
};


//회원가입 요청
export const postJoin = async (userData) => {
  const response = await api.post("/signup", userData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded"},
    });
    return response.data;
};

//회원탈퇴 요청
export const withdrawUser = async (username) => {
  const response = await api.delete(`/users/${username}`);
  return response.data;
};

//아이디 중복 확인
export const checkUsername = async (username) => {
  const res = await api.post(
    "/check-username",
    qs.stringify({ username }), // form 전송
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  return res.data; // { exists: true/false, message: "..." }
};