import React, { useState } from "react";
import { authStore } from "../../store/authStore";
import { useBookReview } from "../../hooks/useBookReview";
import { useBook } from "../../hooks/useBook";
import "../../assets/css/MyReviewsPageStyle.css"
import { useNavigate } from "react-router";

function MyReviewsPage() {
  const navigate = useNavigate();

  const user = authStore((state) => state.user);

  const { getUserBookReviews, deleteBookReview } =
    useBookReview();
  const { data: reviews, isLoading, isError } = getUserBookReviews(user?.userId);

  const { getBookList } = useBook();
  const { data: books } = getBookList();

  const { mutate: deleteMutate } = deleteBookReview();


  //리뷰 삭제 버튼 클릭시
  const handleDelete = (review) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteMutate({ reviewId: review.reviewId, bookId: review.bookId });
    }
  };


  //책이름 가져오기... 백앤드에서 해도 되는데
  const findBookTitle = (bookId) => {
    const book = books && books.content.find((b) => b.bookId === bookId);
    return book ? book.title : "제목 없음";
  };


  if (isLoading) return <div>리뷰 불러오는 중...</div>;
  if (isError) return <div>리뷰 불러오기 실패</div>;

  return (
    <div className="review-page">
      <h2>리뷰 관리</h2>
      <section className="review-container">
        {reviews?.length > 0 ? (
          reviews.map((r) => (
            <div key={r.reviewId} className="review-card">
              <h3>📚 {findBookTitle(r.bookId)}</h3>
              <p>{'⭐'.repeat(r.rating)}</p>
              <p>{r.comment}</p>
              <p>❤️ {r.likes}</p>
              <p className="date">{new Date(r.createdAt).toLocaleString()}</p>
              <div className="btn-group">
                <button className="btn-update" 
                  onClick={() => navigate('/mypage/updatereview', { state: {r}})}>
                  수정
                </button>
                <button className="btn-delete" onClick={() => handleDelete(r)}>
                  삭제
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>아직 작성한 리뷰가 없습니다.</p>
        )}
      </section>
    </div>
  );
}

export default MyReviewsPage;
