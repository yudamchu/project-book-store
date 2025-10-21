import api from "./axios";

// 배송지 관련 API
export const addressAPI = {
  // 배송지 등록
  create: async (data) => {
    const res = await api.post("/addresses", data);
    return res.data;
  },

  // 배송지 목록 조회
  list: async () => {
    const res = await api.get("/addresses");
    return res.data;
  },

  // 배송지 수정
  update: async (addressId, data) => {
    const res = await api.put(`/addresses/${addressId}`, data);
    return res.data;
  },

  // 배송지 삭제
  delete: async (addressId) => {
    const res = await api.delete(`/addresses/${addressId}`);
    return res.data;
  },
};
