import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderAPI } from "../api/orderAPI";
import { useNavigate } from "react-router";

export const useOrder = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
/* ------------------------------ QUERY ------------------------------ */
  //내 주문 내역 조회
  const getMyOrders = () =>
    useQuery({
      queryKey: ["orders", "me"],
      queryFn: orderAPI.getMyOrders,
    });

      //관리자 전체 주문 조회
  const getAllOrders = () =>
    useQuery({
      queryKey: ["orders", "admin"],
      queryFn: orderAPI.getAllOrders,
    });

/* ---------------------------- MUTATIONS ---------------------------- */
  // 단일 주문 생성
  const createOrder = () =>
    useMutation({
      mutationFn: (items) => orderAPI.createOrder(items),
      onSuccess: () => {
        alert("주문이 완료되었습니다!");
        qc.invalidateQueries(["orders", "me"]);
        navigate("/mypage/order/list");
      },
      onError: (error) => {
        const msg =
          error.response?.data?.message || "주문 중 오류가 발생했습니다.";
        alert(msg); // 서버 메시지 표시
        console.error(error);
      },
    });

  // 장바구니 주문 생성
  const createFromCart = () =>
    useMutation({
      mutationFn: ({ cartId, addressId }) =>
        orderAPI.createOrderFromCart(cartId, addressId),
      onSuccess: () => {
        alert("장바구니 주문이 완료되었습니다!");
        qc.invalidateQueries(["orders", "me"]);
        navigate("/");
      },
      onError: (error) => {
        const msg =
          error.response?.data?.message || "주문 중 오류가 발생했습니다.";
        alert(msg); // 재고 / 포인트 부족 안내
        console.error(error);
      },
    });



  //관리자 주문 상태 변경
  const updateStatus = () =>
    useMutation({
      mutationFn: ({ orderId, status }) =>
        orderAPI.updateStatus(orderId, status),
      onSuccess: () => {
        alert("주문 상태가 변경되었습니다.");
        qc.invalidateQueries(["orders", "admin"]);
      },
      onError: () => alert("주문 상태 변경 실패"),
    });

  return {
    getMyOrders,
    createOrder,
    createFromCart,
    getAllOrders,
    updateStatus,
  };
};
