import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBook } from "../../hooks/useBook";
import { useBookImage } from "../../hooks/useBookImage";
import "../../assets/css/AdminBookPageStyle.css";

function AdminBookPage() {
  const navigate = useNavigate();
  const { getBookList, updateBook, deleteBook } = useBook();
  const { getAllImage } = useBookImage();

  const { data: books, isLoading, isError } = getBookList();
  const { data: images } = getAllImage();
  const { mutate: updateBookMutate } = updateBook();
  const { mutate: deleteBookMutate } = deleteBook();

  const [editBookId, setEditBookId] = useState(null);
  const [editData, setEditData] = useState({ price: "", stock: "", isNew: false });

  if (isLoading) return <p>도서 목록 불러오는 중...</p>;
  if (isError) return <p>도서 데이터를 불러오는데 실패했습니다.</p>;

  // 수정 모드로 전환
  const handleEdit = (book) => {
    setEditBookId(book.bookId);
    setEditData({
      price: book.price,
      stock: book.stock,
      isNew: book.isNew,
    });
  };

  // 수정 저장
  const handleSave = (bookId) => {
    updateBookMutate({ bookId, bookData: editData });
    setEditBookId(null);
  };

  // 삭제
  const handleDelete = (bookId) => {
    if (window.confirm("정말 이 도서를 삭제하시겠습니까?")) {
      deleteBookMutate(bookId);
    }
  };

  // 대표 이미지
  const getBookMainImage = (bookId) => {
    const bookImage = images?.find(
      (img) => img.bookId === bookId && img.sortOrder === 1
    );
    return bookImage ? `http://localhost:9090${bookImage.imageUrl}` : "/images/no_image.png";
  };

  return (
    <div className="admin-book-container">
      <h2>📚 도서 관리</h2>
      <button type="button" className="upload-b" 
        onClick={()=>navigate('/admin/books/upload')}
      >도서 등록</button>
      <table className="admin-book-table">
        <thead>
          <tr>
            <th>이미지</th>
            <th>도서명</th>
            <th>저자</th>
            <th>출판사</th>
            <th>가격</th>
            <th>재고</th>
            <th>신간여부</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {books?.content.length ? (
            books.content.map((book) => (
              <tr key={book.bookId}>
                <td>
                  <img
                    src={getBookMainImage(book.bookId)}
                    alt={book.title}
                    className="book-thumbnail"
                  />
                </td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td>
                  {editBookId === book.bookId ? (
                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) =>
                        setEditData({ ...editData, price: Number(e.target.value) })
                      }
                      className="book-input"
                    />
                  ) : (
                    `${book.price.toLocaleString()}원`
                  )}
                </td>
                <td>
                  {editBookId === book.bookId ? (
                    <input
                      type="number"
                      value={editData.stock}
                      onChange={(e) =>
                        setEditData({ ...editData, stock: Number(e.target.value) })
                      }
                      className="book-input"
                    />
                  ) : (
                    `${book.stock}권`
                  )}
                </td>
                <td>
                  {editBookId === book.bookId ? (
                    <select
                      value={editData.isNew}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          isNew: e.target.value === "true",
                        })
                      }
                      className="status-select"
                    >
                      <option value="true">신간</option>
                      <option value="false">일반</option>
                    </select>
                  ) : book.isNew ? (
                    <span className="new-badge">신간</span>
                  ) : (
                    "일반"
                  )}
                </td>
                <td className="action-btns">
                  {editBookId === book.bookId ? (
                    <>
                      <button
                        className="save-btn"
                        onClick={() => handleSave(book.bookId)}
                      >
                        저장
                      </button>
                      <button
                        className="cancel-b"
                        onClick={() => setEditBookId(null)}
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="edit-b"
                        onClick={() => handleEdit(book)}
                      >
                        수정
                      </button>
                      <button
                        className="delete-b"
                        onClick={() => handleDelete(book.bookId)}
                      >
                        삭제
                      </button>
                      <button
                        className="img-manage-btn"
                        onClick={() =>
                          navigate(`/admin/book-images/${book.bookId}`, {
                            state: { book },
                          })
                        }
                      >
                        이미지
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="empty">
                등록된 도서가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBookPage;
