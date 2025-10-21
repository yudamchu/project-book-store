import React, { useState, useEffect } from "react";
import { useBook } from "../../hooks/useBook";
import { useCategory } from "../../hooks/useCategory";
import { useNavigate } from "react-router";
import "../../assets/css/AdminBookUploadPageStyle.css";

function AdminBookUploadPage() {
  const navigate = useNavigate();
  const { createBook } = useBook();
  const { getCategoryList } = useCategory();

  const { data: categories, isLoading: categoryLoading } = getCategoryList();
  const { mutate: createBookMutate } = createBook();

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    publisher: "",
    price: "",
    stock: "",
    isNew: false,
    categoryId: "",
    description: "",
  });

  const [parentCategory, setParentCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    console.log("📚 categories data:", categories);
  }, [categories]);

  // 상위 카테고리 선택 시 하위 카테고리(children) 필터링
  useEffect(() => {
    if (categories && parentCategory) {
      const selectedParent = categories.find(
        (c) => c.categoryId === Number(parentCategory)
      );
      setSubCategories(selectedParent?.children || []);
    } else {
      setSubCategories([]);
    }
  }, [parentCategory, categories]);

  // 도서 등록
  const handleCreateBook = () => {
    if (!newBook.title || !newBook.author || !newBook.price) {
      alert("필수 항목을 입력해주세요.");
      return;
    }

    if (!newBook.categoryId) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    // 도서 등록만 수행
    createBookMutate(
      { bookData: newBook },
      {
        onSuccess: () => {
          alert("도서가 성공적으로 등록되었습니다.");
          navigate("/admin/books");
        },
      }
    );
  };

  if (categoryLoading) return <p>카테고리 불러오는 중...</p>;

  const parentCategories =
    categories?.filter((c) => c.parentId === null) || [];

  return (
    <div className="book-upload-container">
      <h2>📘 새 도서 등록</h2>

      <div className="form-grid">
        <input
          type="text"
          placeholder="도서명"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="저자"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        <input
          type="text"
          placeholder="출판사"
          value={newBook.publisher}
          onChange={(e) =>
            setNewBook({ ...newBook, publisher: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="가격"
          value={newBook.price}
          onChange={(e) =>
            setNewBook({ ...newBook, price: Number(e.target.value) })
          }
        />
        <input
          type="number"
          placeholder="재고"
          value={newBook.stock}
          onChange={(e) =>
            setNewBook({ ...newBook, stock: Number(e.target.value) })
          }
        />
        <select
          value={newBook.isNew}
          onChange={(e) =>
            setNewBook({ ...newBook, isNew: e.target.value === "true" })
          }
        >
          <option value="false">일반</option>
          <option value="true">신간</option>
        </select>
      </div>
      <div className="category-select">
        <select
          value={parentCategory}
          onChange={(e) => {
            setParentCategory(e.target.value);
            setNewBook({ ...newBook, categoryId: "" });
          }}
        >
          <option value="">상위 카테고리 선택</option>
          {parentCategories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={newBook.categoryId}
          onChange={(e) =>
            setNewBook({ ...newBook, categoryId: Number(e.target.value) })
          }
          disabled={!parentCategory}
        >
          <option value="">하위 카테고리 선택</option>
          {subCategories.map((sub) => (
            <option key={sub.categoryId} value={sub.categoryId}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      <textarea
        placeholder="도서 설명 (선택)"
        value={newBook.description}
        onChange={(e) =>
          setNewBook({ ...newBook, description: e.target.value })
        }
      />

      <div className="form-actions">
        <button className="save-btn" onClick={handleCreateBook}>
          등록
        </button>
        <button className="cancel-btn" onClick={() => navigate("/admin/books")}>
          취소
        </button>
      </div>
    </div>
  );
}

export default AdminBookUploadPage;
