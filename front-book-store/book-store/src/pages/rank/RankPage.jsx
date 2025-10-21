import React from 'react';
import { useBookReview } from '../../hooks/useBookReview';
import '../../assets/css/RankPageStyle.css';
import { useNavigate } from 'react-router';

function RankPage(props) {

    const navigate = useNavigate();

    //이달의 랭킹왕 불러오비
    const {getMonthlyRanking} = useBookReview();
    const { data: ranking, isLoading, isError } = getMonthlyRanking();

    if (isLoading) return <p className="rank-loading">📚 랭킹 불러오는 중...</p>;
    if (isError) return <p className="rank-error">❌ 데이터를 불러오지 못했습니다.</p>;


    return (
        <div className="rank-container">
            <h2 className="rank-title">🏆 이달의 독서왕 TOP 10</h2>
            <p>랭킹 Top10에게는 포인트 50,000원을 지급합니다.(지금 일시: 매월 1일)</p>
            <table className="rank-table">
                <thead>
                    <tr>
                        <th>순위</th>
                        <th>사용자</th>
                        <th>리뷰 수</th>
                    </tr>
                </thead>
        <tbody>
          {ranking?.length > 0 ? (
            ranking.map((user, index) => (
              <tr key={user.userId} className={index === 0 ? "first-place" : ""}>
                <td>{index + 1}</td>
                <td className='ranker-btn' onClick={()=> navigate('/ranker/reviews', {state:{userId: user.userId, username: user.username}})}>{user.username}</td>
                <td>{user.reviewCount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                🫥 이번 달에는 리뷰가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    );
}

export default RankPage;