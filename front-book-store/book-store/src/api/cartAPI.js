import api from "./axios";

/* ---------------------------- 장바구니 API ---------------------------- */

export const cartAPI = {
  //장바구니 조회 (로그인 사용자)
  getCart: async () => {
    const res = await api.get("/cart");
    return res.data;
  },

  //장바구니 아이템 추가
  addItem: async ({ bookId, quantity }) => {
    const res = await api.post("/cart/items", { bookId, quantity });
    return res.data;
  },

  //장바구니 아이템 수정 (수량 변경)
  updateItem: async ({ cartItemId, quantity }) => {
    const res = await api.put(`/cart/items/${cartItemId}`, { quantity });
    return res.data;
  },

  //장바구니 아이템 삭제
  deleteItem: async (cartItemId) => {
    const res = await api.delete(`/cart/items/${cartItemId}`);
    return res.data;
  },

  //장바구니 전체 비우기
  clearCart: async () => {
    const res = await api.delete("/cart");
    return res.data;
  },
};
