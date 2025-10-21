import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pointAPI } from "../api/pointAPI";

export const usePoint = () => {
  const qc = useQueryClient();

  /* ------------------------------ QUERY ------------------------------ */

  //포인트 내역 가져오기
  const getMyPoints = () =>
    useQuery({
      queryKey: ["points", "me"],
      queryFn: pointAPI.getMyPoints,
    });

      //관리자 포인트 내역 조회
  const getAllPoints = () =>
    useQuery({
      queryKey: ["points", "admin"],
      queryFn: pointAPI.getAll,
    });
  /* ---------------------------- MUTATIONS ---------------------------- */
 //포인트 충전
  const chargePoint = () =>
    useMutation({
      mutationFn: (amount) => pointAPI.charge(amount),
      onSuccess: () => {
        alert("포인트가 충전되었습니다 💰");
        qc.invalidateQueries(["points", "me"]);
      },
      onError: () => alert("포인트 충전에 실패했습니다."),
    });


  //관리자 특정 사용자 포인트 조정
  const adminChangePoint = () =>
    useMutation({
      mutationFn: ({ userId, data }) => pointAPI.adminChange(userId, data),
      onSuccess: () => {
        alert("관리자가 포인트를 조정했습니다.");
        qc.invalidateQueries(["points", "admin"]);
      },
      onError: () => alert("포인트 조정 실패."),
    });

  return {
    getMyPoints,
    chargePoint,
    getAllPoints,
    adminChangePoint,
  };
};
