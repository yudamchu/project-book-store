import { useNavigate } from "react-router";
import { useUsedBookImage } from "../hooks/useUsedBookImage";
import { useUsedBook } from "../hooks/useUsedBook";
import '../assets/css/UsedBookCard.css'

function UsedBookCard({ filteredBooks, isMyPage = false, columns = 4 }) {

  const navigate = useNavigate();
  const { deleteBook } = useUsedBook();
  const { mutate: deleteMutate } = deleteBook();

  const { getAllImage } = useUsedBookImage();
  const { data: allImages = [] } = getAllImage();

  console.log("allImages:", allImages);

  //상세페이지로 이동
  const goDetail = (usedBookId) => {
    navigate("/useddetails", { state: { usedBookId } });
  };

  //삭제 버튼
  const handleDelete = (usedBookId) => {
    if (!window.confirm("해당 중고 도서를 삭제하시겠습니까?")) return;
    deleteMutate(usedBookId);
  };

  return (
    <div
      className="book-gallery"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(220px, 1fr))`,
      }}
    >
      {filteredBooks.map((book) => {
        const images =
          allImages?.filter((img) => img.usedBookId === book.usedBookId) || [];
        const mainImage =
          images.find((img) => img.sortOrder === 1) || images[0];

        return (
          <div key={book.usedBookId} className="book-card">
            <div
              className="book-img-box"
              onClick={() => goDetail(book.usedBookId)}
            >
              <img
                src={
                  mainImage?.imageUrl
                    ? `http://localhost:9090${mainImage.imageUrl}`
                    : "/images/no_image.png"
                }
                alt={book.title}
                className="book-img"
              />
            </div>

            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">{book.sellerName}</p>

              <div className="book-prices">
                {book.originalPrice && (
                  <p className="book-original">
                    {book.originalPrice?.toLocaleString()}원
                  </p>
                )}
                <p className="book-sale">
                  {book.price?.toLocaleString()}원
                </p>
              </div>

              <p
                className={`book-status ${
                  book.status === "판매중" ? "on-sale" : "sold-out"
                }`}
              >
                {book.status}
              </p>
            </div>

            {isMyPage && (
              <div className="btn-box">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/mypage/usedbooks/update", {
                      state: { usedBookId: book.usedBookId },
                    })
                  }
                >
                  수정
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDelete(book.usedBookId)}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default UsedBookCard;
