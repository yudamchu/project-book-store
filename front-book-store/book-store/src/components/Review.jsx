import styled from "styled-components";
import { useBookReview } from "../hooks/useBookReview";

const ReviewContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 30px;
  padding: 20px;
  border-radius: 5px;
`;

const ReviewCard = styled.div`
  width: 100%;
  border-radius: 10px;
  padding: 1rem 1.2rem;
  text-align: left;
  background-color: #fafafa;
  
`;

const Rating = styled.p`
  font-size: 20px;
  margin-bottom: 0.4rem;
`;

const Comment = styled.p`
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
  margin-bottom: 0.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  color: #666;
  margin-bottom: 30px;
`;



function Review({ bookId }) {
  const { getBookReview, updateBookReview } = useBookReview();
  const { data, isLoading, isError } = getBookReview(bookId);
  const {mutate: updateMutate} = updateBookReview();
   

  if (isLoading) return <div>리뷰 데이터 불러오는 중...</div>;
  if (isError) return <div>리뷰 데이터 로드 실패</div>;


  //좋아요 버튼 클릭시
  const handleLikes = (review) => {
    updateMutate(
      {
      reviewId: review.reviewId,
      rating: review.rating,
      comment: review.comment,
      likes: review.likes + 1,
      bookId, // invalidateQueries에 필요
    }
    )
  }
  return (
    <ReviewContainer>
      {data?.length > 0 ? (
        data.map((review, idx) => (
          <ReviewCard key={review.reviewId}>
            <UserInfo>
              <span style={{fontSize: 20, color:'#7341cf', fontWeight: 700}}>📚 {review.username}</span>
              <span>{new Date(review.createdAt).toLocaleString()}</span>
            </UserInfo>
            <Rating>{'⭐'.repeat(review.rating)}</Rating>
            <Comment>{review.comment}</Comment>
            <button type="button" style={{border: 'none', backgroundColor: 'none'}} onClick={() => handleLikes(review)}>❤️{review.likes}</button>
          </ReviewCard>
        ))
      ) : (
        <div>등록된 리뷰가 없습니다.</div>
      )}
    </ReviewContainer>
  );
}

export default Review;
