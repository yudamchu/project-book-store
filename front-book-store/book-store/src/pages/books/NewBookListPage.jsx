import { useBook } from '../../hooks/useBook';
import '../../assets/css/BookListPageStyle.css';
import BookCard from '../../components/BookCard';

function NewBookListPage(props) {

    const { getBookList } = useBook();
    const { data, isLoading, isError } = getBookList();
    
    if (isLoading) return <div>📚 도서 목록을 불러오는 중...</div>;
    if (isError) return <div>❌ 데이터를 불러오는 중 오류가 발생했습니다.</div>;
    if (!data?.content?.length) return <div>📭 등록된 도서가 없습니다.</div>;
    
    const filteredBooks = data.content.filter((book) => book.isNew);
    
    return (
    <div className="booklist-container">
      <h2 className="category-title">신규 도서</h2>
        <BookCard filteredBooks={filteredBooks}/>
    </div>
    );
}

export default NewBookListPage;