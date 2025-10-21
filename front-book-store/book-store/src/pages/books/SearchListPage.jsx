import React from 'react';
import BookCard from '../../components/BookCard';
import { useLocation } from 'react-router';

function SearchListPage(props) {

    const location = useLocation();
    const {result} = location.state;

    return (
        <div className="booklist-container">
            <h2 className="category-title">{result? `${result.length}개의 검색 결과` : "검색 결과 없음"}</h2>
            <BookCard filteredBooks={result} />
        </div>
    );
}

export default SearchListPage;