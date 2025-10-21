import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentAPI } from "../api/paymentAPI";

export const usePayment = () => {
  const qc = useQueryClient();

  /* ---------------------------- QUERY ---------------------------- */

  //내 결제 내역 조회 
  const getMyPayments = () => {
    return useQuery({
      queryKey: ["payments", "my"],
      queryFn: () => paymentAPI.getMyPayments(),
    });
  };

  //관리자 전체 결제 내역 조회 
  const getAllPayments = () => {
    return useQuery({
      queryKey: ["payments", "admin"],
      queryFn: () => paymentAPI.getAll(),
    });
  };

  /* --------------------------- MUTATION --------------------------- */

  //결제 생성 (포인트 차감 포함) 
  const createPayment = () => {
    return useMutation({
      mutationFn: (amount) => paymentAPI.create(amount),
      onSuccess: () => {
        qc.invalidateQueries(["payments", "my"]);
        alert("결제가 완료되었습니다 ");
      },
      onError: (err) => {
        console.error(err);
        alert("결제 실패 ");
      },
    });
  };

  // 관리자: 결제 상태 변경 
  const updatePaymentStatus = () => {
    return useMutation({
      mutationFn: ({ paymentId, status }) =>
        paymentAPI.updateStatus(paymentId, status),
      onSuccess: () => {
        qc.invalidateQueries(["payments", "admin"]);
        alert("결제 상태가 변경되었습니다 ");
      },
      onError: (err) => {
        console.error(err);
        alert("결제 상태 변경 실패 ");
      },
    });
  };

 

  return {
    getMyPayments,
    getAllPayments,
    createPayment,
    updatePaymentStatus,
  };
};
