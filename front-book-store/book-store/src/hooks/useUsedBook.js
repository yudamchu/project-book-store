import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usedBookAPI } from "../api/usedBookAPI";
import { useNavigate } from "react-router";

export const useUsedBook = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();

  /* ---------------------------- QUERY ---------------------------- */

  const getBookList = () => {
    return useQuery({
      queryKey: ["usedBook"],
      queryFn: () => usedBookAPI.getList(),
    });
  };

  const getBookDetail = (usedBookId) => {
    return useQuery({
      queryKey: ["usedBook", usedBookId],
      queryFn: () => usedBookAPI.getDetail(usedBookId),
      enabled: !!usedBookId,
    });
  };

  /* --------------------------- MUTATION --------------------------- */

  // 등록
  const createBook = () => {
    return useMutation({
      mutationFn: ({ bookData, files }) => usedBookAPI.create(bookData, files),
      onSuccess: async() => {
        await qc.invalidateQueries(["usedBook"]);
        alert("중고 도서가 성공적으로 등록되었습니다.");
      },
      onError: (err) => {
        console.error(err);
        alert("중고 도서 등록 실패!");
      },
    });
  };

  // 수정
  const updateBook = () => {
    return useMutation({
      mutationFn: ({ usedBookId, bookData, files }) =>
        usedBookAPI.update(usedBookId, bookData, files),
      onSuccess: async (_, variables) => {
        await qc.invalidateQueries(["usedBook"]);
        await qc.invalidateQueries(["usedBook", variables.usedBookId]);
        alert("중고 도서가 성공적으로 수정되었습니다.");
        navigate("/mypage/usedbooks");
        
      },
      onError: (err) => {
        console.error(err);
        alert("중고 도서 수정 실패!");
      },
    });
  };

  // 삭제
  const deleteBook = () => {
    return useMutation({
      mutationFn: (usedBookId) => usedBookAPI.delete(usedBookId),
      onSuccess: async() => {
        await qc.invalidateQueries(["usedBook"]);
        alert("도서가 삭제되었습니다.");
        // 현재 경로가 이미 /mypage/usedbooks이면 강제 새로고침
        if (window.location.pathname === "/mypage/usedbooks") {
            window.location.reload();
        } else {
            navigate("/mypage/usedbooks");
        }
      },
      onError: (err) => {
        console.error(err);
        alert("도서 삭제 실패!");
      },
    });
  };

  return {
    getBookList,
    getBookDetail,
    createBook,
    updateBook,
    deleteBook,
  };
};
