import api from "./axios";

export const paymentAPI = {
  //내 결제 내역 조회 
  getMyPayments: async () => {
    const res = await api.get("/payments");
    return res.data;
  },

  //결제 생성 (포인트 차감 후 등록)
  create: async (amount) => {
    const res = await api.post("/payments", { amount });
    return res.data;
  },

  //관리자: 전체 결제 내역 조회 
  getAll: async () => {
    const res = await api.get("/payments/admin");
    return res.data;
  },

  //관리자: 결제 상태 변경 
  updateStatus: async (paymentId, status) => {
    const res = await api.put(`/payments/admin/${paymentId}`, { status: `${status}` });
    return res.data;
  },
};
