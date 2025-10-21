import UsedBookCard from "../../components/UsedBookCard";
import { useUsedBook } from "../../hooks/useUsedBook";
import { authStore } from "../../store/authStore";
import "../../assets/css/MyUsedBookPageStyle.css";
import { useNavigate } from "react-router-dom";

function MyUsedBookPage() {
  const navigate = useNavigate();
  const { user } = authStore.getState(); // 현재 로그인 유저 가져오기
  const { getBookList } = useUsedBook();
  const { data, isLoading, isError } = getBookList();

  if (isLoading) return <div>📚 도서 목록을 불러오는 중...</div>;
  if (isError) return <div>❌ 데이터를 불러오는 중 오류가 발생했습니다.</div>;
  if (!data?.content?.length) return <div>📭 등록된 도서가 없습니다.</div>;

  // 내 도서만 필터링
  const filteredBooks = data.content.filter(
    (book) => book.sellerId === user?.userId
  );

  return (
    <div className="mypage-usedbook">
      <div className="update-usedbook">
        <h2>중고 거래 관리</h2>
        <button onClick={() => navigate("/mypage/usedbooks/upload")}>
          중고 도서 등록
        </button>
      </div>

      <div className="usedbook-history">
        <UsedBookCard filteredBooks={filteredBooks} isMyPage={true} columns={2}/>
      </div>
    </div>
  );
}

export default MyUsedBookPage;
