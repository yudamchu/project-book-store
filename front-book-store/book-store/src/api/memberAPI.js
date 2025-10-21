import api from "./axios";

// 회원 관련 API
export const memberAPI = {
  // 회원 전체 조회 (관리자 전용)
  getAll: async () => {
    const res = await api.get("/member");
    return res.data;
  },

  // 회원 단일 조회 (일반/관리자 공용)
  get: async (userId) => {
    const res = await api.get(`/member/${userId}`);
    return res.data;
  },

  // 회원 정보 수정 (일반 사용자용)
  update: async (userId, userData) => {
    const res = await api.put(`/member/${userId}`, userData);
    return res.data;
  },

  // 회원 정보 수정 (관리자용 - role, status 포함)
  adminUpdate: async (userId, userData) => {
    const res = await api.put(`/member/${userId}/admin`, userData);
    return res.data;
  },

  // 회원 삭제 (관리자용)
  deleteByAdmin: async (userId) => {
    const res = await api.delete(`/member/${userId}/admin`);
    return res.data;
  },

  // 회원 탈퇴 (본인용)
  withdraw: async (userId) => {
    const res = await api.delete(`/users/${userId}`);
    return res.data;
  },
};
