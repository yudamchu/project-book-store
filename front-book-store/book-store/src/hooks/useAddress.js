import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressAPI } from "../api/addressAPI";

export const useAddress = () => {
  const qc = useQueryClient();

  /* ------------------------------ QUERY ------------------------------ */

  // 주소 목록 조회
  const getAddressList = () => {
    return useQuery({
      queryKey: ["address"],
      queryFn: addressAPI.list,
    });
  };

  /* ---------------------------- MUTATIONS ---------------------------- */

  // 주소 등록
  const createAddress = () => {
    return useMutation({
      mutationFn: (data) => addressAPI.create(data),
      onSuccess: () => {
        qc.invalidateQueries(["address"]);
        alert("배송지가 등록되었습니다.");
      },
      onError: (err) => {
        console.error(err);
        alert("배송지 등록 실패");
      },
    });
  };

  // 주소 수정
  const updateAddress = () => {
    return useMutation({
      mutationFn: ({ id, data }) => addressAPI.update(id, data),
      onSuccess: () => {
        qc.invalidateQueries(["addresses"]);
        alert("배송지가 수정되었습니다.");
      },
      onError: (err) => {
        console.error(err);
        alert("배송지 수정 실패");
      },
    });
  };

  // 주소 삭제
  const deleteAddress = () => {
    return useMutation({
      mutationFn: (id) => addressAPI.delete(id),
      onSuccess: () => {
        qc.invalidateQueries(["addresses"]);
        alert("배송지가 삭제되었습니다.");
      },
      onError: (err) => {
        console.error(err);
        alert("배송지 삭제 실패");
      },
    });
  };

  /* -------------------------------------------------------------------- */
  return {
    getAddressList,
    createAddress,
    updateAddress,
    deleteAddress,
  };
};
