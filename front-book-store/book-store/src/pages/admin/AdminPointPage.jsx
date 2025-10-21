import React, { useState } from "react";
import { usePoint } from "../../hooks/usePoint";
import { getAllMembers } from "../../hooks/useMember";
import "../../assets/css/AdminPointPageStyle.css";

function AdminPointPage() {
  const { getAllPoints, adminChangePoint } = usePoint();
  const { data: points, isLoading: pointLoading } = getAllPoints();
  const { data: members, isLoading: memberLoading } = getAllMembers();
  const { mutate: changePointMutate } = adminChangePoint();

  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("ADD"); // ADD=충전, SUB=차감

  if (pointLoading || memberLoading) return <p>로딩 중...</p>;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedUser || !amount) {
      alert("회원과 금액을 모두 입력해주세요 ⚠️");
      return;
    }

    const data = {
      amount: Number(amount),
      type, // ADD or SUB
    };

    changePointMutate({ userId: selectedUser, data });
    setAmount("");
    setSelectedUser("");
  };

  return (
    <div className="admin-point-container">
      <h2>💳 포인트 관리</h2>
      <form className="point-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>회원 선택</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">-- 회원을 선택하세요 --</option>
            {members?.map((m) => (
              <option key={m.userId} value={m.userId}>
                {m.username} ({m.phone})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>포인트 조정 유형</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="ADD">충전</option>
            <option value="SUB">차감</option>
          </select>
        </div>
        <div className="form-group">
          <label>금액</label>
          <input
            type="number"
            min="0"
            placeholder="금액 입력"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button type="submit" className="charge-btn">
          포인트 {type === "ADD" ? "충전" : "차감"}
        </button>
      </form>
      <h3>📜 전체 포인트 내역</h3>
      <table className="admin-point-table">
        <thead>
          <tr>
            <th>회원명</th>
            <th>변동 금액</th>
            <th>잔액</th>
            <th>변동 일시</th>
          </tr>
        </thead>
        <tbody>
          {points?.length ? (
            points.map((p) => (
              <tr key={p.pointId}>
                <td>{p.username}</td>
                <td
                  className={
                    p.points > 0 ? "plus" : "minus"
                  }
                >
                  {p.amount > 0
                    ? `+${p.points.toLocaleString()}`
                    : p.points.toLocaleString()}{" "}
                  P
                </td>
                <td>{p.balance.toLocaleString()} P</td>
                <td>
                  {new Date(p.createdAt).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="empty">
                포인트 내역이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPointPage;
