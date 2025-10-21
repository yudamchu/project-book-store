import api from "./axios"; 

export const orderAPI = {
  //단일 주문 생성
  createOrder: async (items) => {
    const res = await api.post("/orders", items);
    return res.data;
  },

  //장바구니 주문 기반 생성
  createOrderFromCart: async (cartId, addressId) => {
    const res = await api.post(`/orders/from-cart`, { cartId, addressId });
    return res.data;
  },

  //내 주문내역 조회
  getMyOrders: async () => {
    const res = await api.get("/orders");
    return res.data;
  },

  //관리자 전체 주문 내역 조회
  getAllOrders: async () => {
    const res = await api.get("/orders/admin");
    return res.data;
  },

  //관리자 주문 상태 변경('결제완료', '배송중', '완료', '취소')
  updateStatus: async (orderId, status) => {
    const res = await api.put(`/orders/admin/${orderId}`, {status: `${status}`});
    return res.data;
  },
};
