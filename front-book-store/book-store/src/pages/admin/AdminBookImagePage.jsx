import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useBookImage } from "../../hooks/useBookImage";
import "../../assets/css/AdminBookImagePageStyle.css";

function AdminBookImagePage() {
  const { bookId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const book = location.state?.book; // AdminBookPage에서 넘긴 책 정보

  const { getBookImage, createBookImage, updateSortImage, deleteBookImages } =
    useBookImage();

  const { data: images, isLoading, isError } = getBookImage(bookId);
  const { mutate: uploadMutate } = createBookImage();
  const { mutate: updateSortMutate } = updateSortImage();
  const { mutate: deleteMutate } = deleteBookImages();

  const [files, setFiles] = useState([]);
  const [hasMainImage, setHasMainImage] = useState(true);

  //  대표 이미지 존재 여부 감시
  useEffect(() => {
    if (images && images.length > 0) {
      const foundMain = images.some((img) => img.sortOrder === 1);
      setHasMainImage(foundMain);
    }
  }, [images]);

  if (isLoading) return <p>이미지 불러오는 중...</p>;
  if (isError) return <p>이미지를 불러오는데 실패했습니다.</p>;

  // 파일 선택
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  // 업로드
  const handleUpload = () => {
    if (!files.length) {
      alert("이미지를 선택해주세요.");
      return;
    }
    uploadMutate({ bookId, files });
    setFiles([]);
  };

  // 순서 변경 (직접 입력 시)
  const handleSortChange = (imageId, value) => {
    updateSortMutate({ imageId, sortOrder: Number(value) });
  };

  // 삭제
  const handleDelete = (imageId) => {
    if (window.confirm("이 이미지를 삭제하시겠습니까?")) {
      deleteMutate({ imageId });
    }
  };

  // 대표 이미지 설정
  const handleSetMain = (selectedImageId) => {
    if (!images || images.length === 0) return;

    // 대표 이미지로 지정
    updateSortMutate({ imageId: selectedImageId, sortOrder: 1 });

    // 나머지는 순서 2부터 재정렬
    let order = 2;
    images
      .filter((img) => img.imageId !== selectedImageId)
      .forEach((img) => {
        updateSortMutate({ imageId: img.imageId, sortOrder: order });
        order++;
      });

    alert("대표 이미지가 변경되었습니다.");
  };

  // 수정 완료 버튼
  const EditBtn = () => {
    if (!hasMainImage) {
      alert("대표 이미지가 없습니다. 대표이미지를 지정해주세요.");
      return;
    }
    navigate("/admin/books");
  };

  return (
    <div className="admin-image-container">
      <div className="header-section">
        <button className="back-btn" onClick={EditBtn}>
          수정 완료
        </button>
        <h2>📸 {book?.title || "도서"} 이미지 관리</h2>
      </div>
      {!hasMainImage && (
        <div className="warning-box">
          ⚠️ 대표 이미지가 없습니다.
          <span>대표 이미지를 지정해주세요.</span>
        </div>
      )}
      <div className="upload-section">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          accept="image/*"
        />
        <button className="up-button" onClick={handleUpload}>
          업로드
        </button>
      </div>
      <table className="admin-image-table">
        <thead>
          <tr>
            <th>이미지 미리보기</th>
            <th>순서</th>
            <th>등록일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {images?.length ? (
            images.map((img) => (
              <tr
                key={img.imageId}
                className={img.sortOrder === 1 ? "main-image-row" : ""}
              >
                <td className="img-td">
                  <img
                    src={`http://localhost:9090${img.imageUrl}`}
                    alt={`도서 이미지 ${img.imageId}`}
                    className="book-image"
                  />
                  {img.sortOrder === 1 && (
                    <p className="main-label">대표</p>
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={img.sortOrder}
                    onChange={(e) =>
                      handleSortChange(img.imageId, e.target.value)
                    }
                    className="sort-input"
                  />
                </td>
                <td>
                  {new Date(img.uploadedAt).toLocaleString("ko-KR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
                <td className="action-buttons">
                  <button
                    className="set-main-btn"
                    onClick={() => handleSetMain(img.imageId)}
                  >
                    대표 지정
                  </button>
                  <button
                    className="delete-bn"
                    onClick={() => handleDelete(img.imageId)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="empty">
                등록된 이미지가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBookImagePage;
