import api from "./axios";

export const pointAPI = {
  //내포인트 내역 조회
  getMyPoints: async () => {
    const res = await api.get("/points/me");
    return res.data;
  },

  //포인트 충전
  charge: async (amount) => {
    const res = await api.post("/points/charge", { amount });
    return res.data;
  },

  //관리자 전체 사용자 포인트 내역 조회
  getAll: async () => {
    const res = await api.get("/points/admin");
    return res.data;
  },

  //관리자 특정 사용자 포인트 내역 수정 
  adminChange: async (userId, data) => {
    const res = await api.post(`/points/admin/change/${userId}`, data);
    return res.data;
  },
};
