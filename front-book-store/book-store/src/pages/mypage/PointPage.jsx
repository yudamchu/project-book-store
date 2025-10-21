import React, { useState } from 'react';
import { usePoint } from '../../hooks/usePoint';
import '../../assets/css/PointPageStyle.css';

function PointPage() {
  const { getMyPoints, chargePoint } = usePoint();

  // 포인트 내역 조회
  const { data: points, isLoading } = getMyPoints();

  // 포인트 충전
  const { mutate: chargeMutate } = chargePoint();
  const [amount, setAmount] = useState("");

  if (isLoading) return <p>로딩 중...</p>;

  return (
    <div className="point-container">
      <h2 className='main-title'>포인트 관리</h2>
      <section className="balance-info" >
        <h2>총 포인트 💳</h2>
        <p>
          {points && points.length > 0 ? `${points[0].balance.toLocaleString()} P` : "0 P"}
        </p>
      </section>
      <section className="point-history">
        <h3>포인트 변동 내역</h3>
        <table className="history-table">
          <thead>
            <tr>
              <th>날짜</th>
              <th>유형</th>
              <th>변동 금액</th>
              <th>잔액</th>
            </tr>
          </thead>
          <tbody>
            {points?.map((x) => (
              <tr key={x.pointId}>
                <td>{new Date(x.createdAt).toLocaleString()}</td>
                <td>{x.changeType}</td>
                <td
                  style={{
                    color: x.points < 0 ? "red" : "green",
                    fontWeight: "bold",
                  }}
                >
                  {x.points > 0 ? `+${x.points.toLocaleString()}` : x.points.toLocaleString()}
                </td>
                <td>{x.balance.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="charge-bx">
        <input
          type="number"
          placeholder="충전할 금액을 입력하세요"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          type="button"
          className='charge-bn'
          onClick={() => chargeMutate(Number(amount))}
        >
          포인트 충전
        </button>
      </section>
    </div>
  );
}

export default PointPage;
