import React, { useState } from "react";
import { useBook } from "../../hooks/useBook";
import { useUsedBook } from "../../hooks/useUsedBook";
import { useUsedBookImage } from "../../hooks/useUsedBookImage";
import "../../assets/css/UsedBookUploadStyle.css";
import { useNavigate } from "react-router";

function UploadUsedBook() {

  const navigate = useNavigate();

  const { getBookList } = useBook();
  const { data: books } = getBookList();

  const { createBook } = useUsedBook();
  const { mutate: createMutate } = createBook();

  const { getBookImage, updateSortImage } = useUsedBookImage();

  // 대표 이미지 순서 변경 훅
  const { mutate: sortImageMutate } = updateSortImage();

  // 등록 완료 후 이미지 목록 불러오기
  const [usedBookId, setUsedBookId] = useState(null);
  const { data: images } = getBookImage(usedBookId, { enabled: !!usedBookId });

  const [form, setForm] = useState({
    bookId: "",
    price: "",
    condition: "중",
    status: "판매중",
    title: "",
    description: "",
  });

  const [files, setFiles] = useState([]);
  const [sort, setSort] = useState(1); // 기본 1
  const [isUploaded, setIsUploaded] = useState(false);

  // 폼 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 책 선택 시 bookId 매핑
  const handleSelectBook = (e) => {
    const selectedTitle = e.target.value;
    const book = books?.content.find((b) => b.title === selectedTitle);
    if (book) setForm((prev) => ({ ...prev, bookId: book.bookId }));
  };

  // 이미지 선택
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 등록 버튼 클릭
  const handleSubmit = () => {
    if (!form.bookId || !form.price || !form.title || !form.description) {
      alert("모든 필드를 입력해주세요!");
      return;
    }

    if (files.length === 0) {
      alert("이미지를 업로드해주세요!");
      return;
    }

    createMutate(
      { bookData: form, files },
      {
        onSuccess: (data) => {
          setIsUploaded(true);
          setUsedBookId(data.usedBookId); //서버 응답에 등록된 usedBookId 포함되어야 함
        }
      }
    );
  };

  // 대표 이미지 지정
  const handleSortChange = (e) => setSort(Number(e.target.value));

  const handleSortSubmit = (imageId) => {
    if (!sort || sort < 1) {
      alert("순서는 1 이상의 숫자여야 합니다.");
      return;
    }
    sortImageMutate(
      { imageId, sortOrder: sort }
    );
    navigate(-1);
  };

  return (
    <div className="usedbook-upload">
      <h2>중고 도서 등록</h2>

      <label>
        도서 선택 (제목으로)
        <select onChange={handleSelectBook}>
          <option value="">도서 제목 선택</option>
          {books?.content.map((b) => (
            <option key={b.bookId} value={b.title}>
              {b.title}
            </option>
          ))}
        </select>
      </label>

      <label>
        판매글 제목
        <input name="title" value={form.title} onChange={handleChange} />
      </label>

      <label>
        가격
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
        />
      </label>

      <label>
        도서 상태
        <select name="condition" value={form.condition} onChange={handleChange}>
          <option value="상">상</option>
          <option value="중">중</option>
          <option value="하">하</option>
        </select>
      </label>

      <label>
        판매 상태
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="판매중">판매중</option>
          <option value="거래완료">거래완료</option>
        </select>
      </label>

      <label>
        설명
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </label>

      {/* 이미지 업로드 */}
      <div className="upload-images">
        <input type="file" multiple onChange={handleFileChange} />
        <ul>
          {files.map((file, i) => (
            <li key={i}>
              {file.name}{" "}
              <button type="button" onClick={() => removeFile(i)}>
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button className="upload-btn" type="button" onClick={handleSubmit}>
        등록
      </button>

      {/* ✅ 등록 후 대표 이미지 설정 */}
      {isUploaded && images && (
        <div className="sort-cont">
          <h2>대표 이미지 설정</h2>
          <div className="image-sort-list">
            {images.map((x, i) => (
              <div key={i} className="image-sort-item">
                <img
                  src={`http://localhost:9090${x.imageUrl}`}
                  alt={`이미지-${i}`}
                  width={100}
                />
                <div>
                  <label className="input-cont">순서: 
                  <input
                    type="number"
                    value={sort}
                    min={1}
                    onChange={handleSortChange}
                  />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSortSubmit(x.imageId)}
                  >
                    순서 지정
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadUsedBook;
