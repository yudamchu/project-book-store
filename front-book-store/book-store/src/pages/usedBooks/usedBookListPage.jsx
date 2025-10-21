import '../../assets/css/BookListPageStyle.css';
import UsedBookCard from '../../components/UsedBookCard';
import { useUsedBook } from '../../hooks/useUsedBook';

function usedBookListPage(props) {
    
    //도서 정보 가져오기
    const { getBookList } = useUsedBook();
    const { data, isLoading, isError } = getBookList();

    if (isLoading) return <div>📚 도서 목록을 불러오는 중...</div>;
    if (isError) return <div>❌ 데이터를 불러오는 중 오류가 발생했습니다.</div>;
    if (!data?.content?.length) return <div>📭 등록된 도서가 없습니다.</div>;

    //거래완료 된건 안뜨도록
    const filteredBooks = data.content.filter(x=> x.status !=='거래완료');
    console.log("중고 도서 리스트:", data.content);

  return (
    <div className="booklist-container">
      <h2 className="category-title">중고 도서</h2>
        <UsedBookCard filteredBooks={filteredBooks} isMyPage={false} columns={4}/>
    </div>
    );
}

export default usedBookListPage;