import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { useBookReview } from '../../hooks/useBookReview';
import '../../assets/css/CreateReviewStyle.css';

function CreateReview(props) {

    const location = useLocation();
    const order = location.state.order;

    const {createBookReview} = useBookReview();
    const { mutate: createMutate } = createBookReview();

    
    const books = order.items;
    
    //리뷰 등록 - 결제 구현 후 따로 페이지 만들것
    const [newReview, setNewReview] = useState({
        bookId: "",
        rating: "",
        comment: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewReview((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleCreate = () => {
        if (!newReview.bookId || !newReview.rating || !newReview.comment) {
            alert("모든 항목을 입력해주세요.");
        return;
        }
        createMutate({
            bookId: Number(newReview.bookId),
            rating: Number(newReview.rating),
            comment: newReview.comment,
        });
        setNewReview({ bookId: "", rating: "", comment: "" });
    };

    return (
        <div className="review-form">
        <h2>리뷰 등록</h2>
        <select
          name="bookId"
          value={newReview.bookId}
          onChange={handleChange}
          className="review-select"
        >
          <option value="">도서 선택</option>
          {books?.map((b) => (
            <option key={b.bookId} value={b.bookId}>
              {b.bookTitle}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="rating"
          placeholder="별점 (1~5)"
          value={newReview.rating}
          onChange={handleChange}
          className="review-input"
          min="1"
          max="5"
        />
        <input
          type="text"
          name="comment"
          placeholder="리뷰 내용"
          value={newReview.comment}
          onChange={handleChange}
          className="review-input"
          id='descript'
        />
        <button type="button" className="btn-create" onClick={handleCreate}>
          등록
        </button>
      </div>
    );
}

export default CreateReview;