import React from 'react';
import { useBookImage } from '../hooks/useBookImage';
import { useNavigate } from 'react-router';
import '../assets/css/BookCard.css';

function BookCard({ filteredBooks }) {
  const navigate = useNavigate();

  const { getAllImage } = useBookImage();
  const { data: images = [], isLoading, isError } = getAllImage();

  if (isLoading) return <div>📸 이미지 불러오는 중...</div>;
  if (isError) return <div>❌ 이미지 로드 실패</div>;

  // 대표 이미지(sortOrder === 1)만 가져오기
  const mainImages = images.filter((img) => img.sortOrder === 1);
  console.log("📸 이미지 데이터:", images);

  const DetailBtn = (bookId) => {
    navigate('/detail', {state: {bookId}});
  }


  return (
    <div className="book-gallery">
      {filteredBooks.map((book) => {
        const image = mainImages.find((img) => img.bookId === book.bookId);

        return (
          <div key={book.bookId} className="book-card" onClick={() => DetailBtn(book.bookId)}>
            <div className="book-img-box">
              <img
              src={`http://localhost:9090${image?.imageUrl}` || '/images/no_image.png'}
              alt={book.title}
              className="book-img"
              />
            </div>
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">{book.author}</p>
              <p className="book-publisher">{book.publisher}</p>
              <p className="book-price">{book.price.toLocaleString()}원</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BookCard;
