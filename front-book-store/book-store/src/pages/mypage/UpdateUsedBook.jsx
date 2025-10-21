import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUsedBook } from "../../hooks/useUsedBook";
import { useUsedBookImage } from "../../hooks/useUsedBookImage";
import '../../assets/css/UpdateUsedBook.css'


function UpdateUsedBook() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usedBookId } = location.state || {};

  const { getBookDetail, updateBook } = useUsedBook();
  const { data: book, isLoading, isError } = getBookDetail(usedBookId);

  const { getBookImage, deleteBookImages, updateSortImage } =
    useUsedBookImage();
  const { data: imageList = [] } = getBookImage(usedBookId);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    condition: "",
    status: "",
  });
  const [files, setFiles] = useState([]);

  const { mutate: updateMutate } = updateBook();
  const { mutate: deleteImageMutate } = deleteBookImages();
  const { mutate: updateSortMutate } = updateSortImage();

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title || "",
        description: book.description || "",
        price: book.price || "",
        condition: book.condition || "중",
        status: book.status || "판매중",
      });
    }
  }, [book]);

  //수정 내용 담기
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  //이미지 파일 삭제
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  //이미지 순서 지정
  const handleSortChange = (imageId, newOrder) => {
    updateSortMutate({ imageId, sortOrder: newOrder });
  };

  //이미지 삭제
  const handleDeleteImage = (imageId) => {
    if (window.confirm("이미지를 삭제하시겠습니까?")) {
      deleteImageMutate({ imageId });
    }
  };

  //수정 버튼 클릭시 
  const handleSubmit = () => {
    if (!form.title || !form.price) {
      alert("필수 항목을 입력해주세요.");
      return;
    }

    updateMutate(
      {
        usedBookId,
        bookData: {
          ...form,
          price: Number(form.price),
        },
        files,
      }
    );
  };

  if (isLoading) return <div>📖 도서 정보를 불러오는 중...</div>;
  if (isError) return <div>❌ 도서 정보를 불러오지 못했습니다.</div>;

  return (
    <div className="usedbook-upload">
      <h2>중고 도서 수정</h2>

      <div className="upload-form">
        <label>
          제목
          <input name="title" value={form.title} onChange={handleChange} />
        </label>
        <label>
          설명
          <textarea name="description" value={form.description} onChange={handleChange} />
        </label>
        <label>
          가격
          <input name="price" type="number" value={form.price} onChange={handleChange} />
        </label>
        <label>
          상태
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="판매중">판매중</option>
            <option value="거래완료">거래완료</option>
          </select>
        </label>
      </div>
      <div className="image-section">
        <h3>📸 이미지 관리</h3>
        <input type="file" multiple onChange={handleFileChange} />
        <ul>
          {files.map((file, i) => (
            <li key={i}>
              {file.name}
              <button type="button" onClick={() => removeFile(i)}>삭제</button>
            </li>
          ))}
        </ul>
        <div className="image-list">
          {imageList.length > 0 ? (
            imageList
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((img) => (
                <div key={img.imageId} className="image-item">
                  <img
                    src={`http://localhost:9090${img.imageUrl}`}
                    alt="book"
                  />
                  <div className="image-controls">
                    <input
                      type="number"
                      min="1"
                      value={img.sortOrder}
                      onChange={(e) =>
                        handleSortChange(img.imageId, Number(e.target.value))
                      }
                    />
                    <button onClick={() => handleDeleteImage(img.imageId)}>X</button>
                  </div>
                </div>
              ))
          ) : (
            <p>등록된 이미지가 없습니다.</p>
          )}
        </div>
      </div>

      <div className="upload-buttons">
        <button onClick={handleSubmit}>수정</button>
        <button onClick={() => navigate(-1)}>취소</button>
      </div>
    </div>
  );
}

export default UpdateUsedBook;
