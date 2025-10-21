import React from 'react';
import { useBook } from '../../hooks/useBook';
import { useLocation } from 'react-router';
import { useCategory } from '../../hooks/useCategory';
import '../../assets/css/BookListPageStyle.css';
import BookCard from '../../components/BookCard';

function BookListPage() {

  //클릭한 카테고리의 아이디 가져오기
  const location = useLocation();
  const { id } = location.state;
  const categoryId = Number(id);

  //카테고리 정보 가져오기
  const { getCategory } = useCategory();
  const { data: category } = getCategory(categoryId);

  //도서 정보 가져오기
  const { getBookList } = useBook();
  const { data, isLoading, isError } = getBookList();



  if (isLoading) return <div>📚 도서 목록을 불러오는 중...</div>;
  if (isError) return <div>❌ 데이터를 불러오는 중 오류가 발생했습니다.</div>;
  if (!data?.content?.length) return <div>📭 등록된 도서가 없습니다.</div>;

  //해당 카테고리의 도서만 가져오기
  const filteredBooks = data.content.filter((book) => book.categoryId === categoryId);

  return (
    <div className="booklist-container">
      <h2 className="category-title">{category?.name || "카테고리"}</h2>
        <BookCard filteredBooks={filteredBooks} />
    </div>
  );
}

export default BookListPage;
