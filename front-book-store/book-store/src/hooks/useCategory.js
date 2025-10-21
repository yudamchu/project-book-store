import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryAPI } from "../api/categoryAPI";


export const useCategory = () => {
  const qc = useQueryClient();

  /* ------------------------------ QUERY ------------------------------ */

  // 카테고리 목록 조회
  const getCategoryList = () => {
    return useQuery({
      queryKey: ["category"],
      queryFn: categoryAPI.getList
    });
  };

  // 카테고리 상세 조회
  const getCategory = (categoryId) => {
    return useQuery({
      queryKey: ["category", categoryId],
      queryFn: () => categoryAPI.getDetail(categoryId)
    });
  };
  /* ---------------------------- MUTATIONS ---------------------------- */

  // 주소 등록
  const createCategory = () => {
    return useMutation({
      mutationFn: (data) => categoryAPI.create(data),
      onSuccess: () => {
        qc.invalidateQueries(["category"]);
        alert("카테고리가 성공적으로 등록되었습니다.");
      },
      onError: (err) => {
        console.error(err);
        alert("카테고리 등록 실패");
      },
    });
  };

  // 카테고리 수정
  const updateCategory = (_, variables) => {
    return useMutation({
      mutationFn: (categoryId) => categoryAPI.update(categoryId),
      onSuccess: () => {
        qc.invalidateQueries(["category"], variables.categoryId);
        qc.invalidateQueries(["category"]);
        alert("카테고리가 성공적으로 수정되었습니다.");
      },
      onError: (err) => {
        console.error(err);
        alert("카테고리 수정 실패");
      },
    });
  };

  // 카테고리 삭제
  const deleteCategory = () => {
    return useMutation({
      mutationFn: (categoryId) => categoryAPI.delete(categoryId),
      onSuccess: () => {
        qc.invalidateQueries(["category"]);
        alert("카테고리가 성공적으로 삭제되었습니다.");
      },
      onError: (err) => {
        console.error(err);
        alert("카테고리 삭제 실패");
      },
    });
  };

  /* -------------------------------------------------------------------- */
  return {
    getCategoryList,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
  };
};
