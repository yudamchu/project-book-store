import AutoBanner from '../../components/AutoBanner';
import '../../assets/css/MainPage.css'
import BookCard from '../../components/BookCard';
import { useBook } from '../../hooks/useBook';


function MainPage(props) {

    const { getBookList } = useBook();
    const { data, isLoading, isError } = getBookList();
    
    if (isLoading) return <div>📚 도서 목록을 불러오는 중...</div>;
    if (isError) return <div>❌ 데이터를 불러오는 중 오류가 발생했습니다.</div>;
    if (!data?.content?.length) return <div>📭 등록된 도서가 없습니다.</div>;
    

      // 랜덤으로 8개 추출
    const getRandomBooks = (books, count) => {
        const shuffled = [...books].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    };

    const randomBooks = getRandomBooks(data.content, 8);

    return (
        <>
        <div className='main-container'>
           <AutoBanner /> 
           <section className='today-books'>
            <h2>
                오늘의 <a style={{ color: "#7C3AED" }}>Pick</a>
            </h2>
                <BookCard filteredBooks={randomBooks}/>
           </section>
        </div>
        </> 
    );
}

export default MainPage;