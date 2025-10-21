import React, { useState } from 'react';
import { useBookReview } from '../../hooks/useBookReview';
import { useLocation, useNavigate } from 'react-router';
import '../../assets/css/UpdateReviewStyle.css';

function UpdateReview(props) {

    const location = useLocation();
    const navigate = useNavigate();
   

    const {r: review} = location.state;
    console.log(review);

    const [rateInput, setRateInput] = useState(review?.rating || '');
    const [commentInput, setCommentInput] = useState(review.comment || '');

    const {updateBookReview} = useBookReview();
    const { mutate: updateMutate } = updateBookReview();

    //수정 버튼 클릭시
    const editBtn = () => {
        updateMutate({
        reviewId: review.reviewId,
        rating: Number(rateInput),
        comment: commentInput,
        bookId: review.bookId,
      });
        alert('리뷰가 수정되었습니다.');
        navigate(-1);
    }


    return (
        <div className='review-edit'>
            <h2>리뷰 수정</h2>
            <label htmlFor="rating">별점
                <input value={rateInput} onChange={(e)=> setRateInput(e.target.value)}/>
            </label>
            <label htmlFor="rating">리뷰 내용
                <input value={commentInput} onChange={(e)=> setCommentInput(e.target.value)}/>
            </label>
            <div className='buttom-cont'>
                <button type='button' className='edit-btn' onClick={editBtn}>수정</button>
                <button type='button' className='delete-btn' onClick={()=> navigate(-1)}>취소</button>
            </div>
        </div>
    );
}

export default UpdateReview;