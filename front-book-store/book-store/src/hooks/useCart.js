import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartAPI } from "../api/cartAPI";
import { authStore } from "../store/authStore";

export const useCart = () => {

  const isLogin = authStore(state => state.isLogin)
  const qc = useQueryClient();
/* ------------------------------ QUERY ------------------------------ */
 //장바구니 조회
  const getCart = () => {
    return useQuery({
      queryKey: ["cart"],
      queryFn: () => cartAPI.getCart(),
    });
  };
/* ---------------------------- MUTATIONS ---------------------------- */
  //장바구니에 아이템 추가
  const addItem = () => {
    return useMutation({
      mutationFn: ({ bookId, quantity }) => cartAPI.addItem({ bookId, quantity }),
      onSuccess: () => {
        if(isLogin){
        qc.invalidateQueries(["cart"]);
        alert("장바구니에 상품이 추가되었습니다 🛒");
        }
      },
      onError: (err) => {
        console.log(err);
        console.log("장바구니 추가 실패");
      },
    });
  };

  //아이템 수량 수정
  const updateItem = () => {
    return useMutation({
      mutationFn: ({ cartItemId, quantity }) =>
        cartAPI.updateItem({ cartItemId, quantity }),
      onSuccess: () => {
        qc.invalidateQueries(["cart"]);
      },
      onError: (err) => {
        console.error(err);
        alert("수량 수정 실패");
      },
    });
  };

  //장바구니 아이템 삭제
  const deleteItem = () => {
    return useMutation({
      mutationFn: (cartItemId) => cartAPI.deleteItem(cartItemId),
      onSuccess: () => {
        qc.invalidateQueries(["cart"]);
      },
      onError: (err) => {
        console.error(err);
        alert("삭제 실패");
      },
    });
  };

  //장바구니 전체 비우기
  const clearCart = () => {
    return useMutation({
      mutationFn: () => cartAPI.clearCart(),
      onSuccess: () => {
        qc.invalidateQueries(["cart"]);
      },
      onError: (err) => {
        console.error(err);
        alert("장바구니 비우기 실패");
      },
    });
  };

  return { getCart, addItem, updateItem, deleteItem, clearCart };
};
