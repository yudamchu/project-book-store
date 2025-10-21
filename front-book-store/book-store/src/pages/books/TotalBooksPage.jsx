import React, { useEffect, useState } from 'react';
import '../../assets/css/BookListPageStyle.css';
import { useBook } from '../../hooks/useBook';
import BookCard from '../../components/BookCard';

function TotalBooksPage(props) {
    const { getBookList } = useBook();
    const { data, isLoading, isError } = getBookList();

    const [filteredBooks, setFilteredBooks] = useState([]);
    const [count, setCount] = useState(8);
    const [isActive, setIsActive] = useState(false);

    if (isLoading) return <div>📚 도서 목록을 불러오는 중...</div>;
    if (isError) return <div>❌ 데이터를 불러오는 중 오류가 발생했습니다.</div>;
    if (!data?.content?.length) return <div>📭 등록된 도서가 없습니다.</div>;
    
    let size = 8;
    console.log("도서", data);
    //setFilteredBooks(data?.content?.slice(0,size) || []);
    //데이터가 로드된 후 한 번만 초기화
    useEffect(() => {
        if (data?.content?.length) {
            setFilteredBooks(data.content.slice(0, size));
        }
    }, [data]);

    //더보기 버튼
    const moreBtn = () => {
        let c = count + size;
        const newBooks = data.content.slice(0,c);
        
        setFilteredBooks(newBooks);
        setCount(c);

        //더보기 필요 없으면
        if(data.content.length < c){
            setIsActive(true);
        }

    }
    return (
        <div className="booklist-container">
            <h2 className="category-title">전체 도서</h2>
            <BookCard filteredBooks={filteredBooks}/>
            {
                isActive? null :
                <div className='more-btn' onClick={moreBtn} style={{display: 'flex', justifySelf: 'center', marginTop: 30, padding: 10, border: '1px solid rgb(117, 77, 211)',  borderRadius: 30}}>더보기</div>
            }
        </div>
    );
}

export default TotalBooksPage;
