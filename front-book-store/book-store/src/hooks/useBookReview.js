import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookReviewAPI } from "../api/bookReviewAPI";

export const useBookReview = () => {
  const qc = useQueryClient();

  /* ------------------------------ QUERY ------------------------------ */
  // 특정 도서의 리뷰 조회
  const getBookReview = (bookId) => {
    return useQuery({
      queryKey: ["bookReviews", bookId],
      queryFn: () => bookReviewAPI.get(bookId),
      enabled: !!bookId,
    });
  };

  //특정 사용자 리뷰 조회
  const getUserBookReviews = (userId) => {
  return useQuery({
    queryKey: ["userBookReviews", userId],
    queryFn: () => bookReviewAPI.getByUser(userId),
    enabled: !!userId,
    });
  };

  //이달의 랭킹
  const getMonthlyRanking = () => {
  return useQuery({
    queryKey: ["monthlyRanking"],
    queryFn: () => bookReviewAPI.getMonthlyRanking(),
  });
};

  /* ---------------------------- MUTATIONS ---------------------------- */
  // 리뷰 등록
  const createBookReview = () => {
    return useMutation({
      mutationFn: ({ bookId, rating, comment }) =>
        bookReviewAPI.create(bookId, rating, comment),
      onSuccess: (_, variables) => {
        qc.invalidateQueries(["bookReviews", variables.bookId]);
        alert("리뷰가 성공적으로 등록되었습니다.");
      },
      onError: (err) => {
        console.error(err);
        alert("리뷰 등록 실패");
      },
    });
  };

  // 리뷰 수정
  const updateBookReview = () => {
    return useMutation({
      mutationFn: ({ reviewId, rating, comment, likes }) =>
        bookReviewAPI.update(reviewId, rating, comment, likes),
      onSuccess: (_, variables) => {
        qc.invalidateQueries(["bookReviews", variables.bookId]);
      },
      onError: (err) => {
        console.error(err);
        alert("리뷰 수정 실패");
      },
    });
  };

  // 리뷰 삭제
  const deleteBookReview = () => {
    return useMutation({
      mutationFn: ({ reviewId }) => bookReviewAPI.delete(reviewId),
      onSuccess: (_, variables) => {
        qc.invalidateQueries(["bookReviews", variables.bookId]);
        alert("리뷰가 성공적으로 삭제되었습니다.");
      },
      onError: (err) => {
        console.error(err);
        alert("리뷰 삭제 실패");
      },
    });
  };

  return {
    getBookReview,
    getUserBookReviews,
    getMonthlyRanking,
    createBookReview,
    updateBookReview,
    deleteBookReview,
  };
};
