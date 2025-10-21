import { useLocation } from 'react-router';
import { useBookReview } from '../../hooks/useBookReview';
import '../../assets/css/RankerReviewPageStyle.css'
import { useBook } from '../../hooks/useBook';

function RankerReviewPage(props) {
    const location = useLocation();
    const {userId, username} = location.state;

    const {getUserBookReviews} = useBookReview();
    const {data: reviews} = getUserBookReviews(userId);

    const { getBookList } = useBook();
    const { data: books } = getBookList();


    //책이름 가져오기
    const findBookTitle = (bookId) => {
    const book = books && books.content.find((b) => b.bookId === bookId);
        return book ? book.title : "제목 없음";
    };

    return (
        <div className='ranker-reviews'>
        <h2>{username}님의 리뷰</h2>
        {reviews?.length > 0 ? (
          reviews.map((r) => (
            <div key={r.reviewId} className="review-p">
              <h3>📚 {findBookTitle(r.bookId)}</h3>
              <p>{'⭐'.repeat(r.rating)}</p>
              <p>{r.comment}</p>
              <p>❤️ {r.likes}</p>
              <p className="date">{new Date(r.createdAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>아직 작성한 리뷰가 없습니다.</p>
        )} 
        </div>
    );
}

export default RankerReviewPage;