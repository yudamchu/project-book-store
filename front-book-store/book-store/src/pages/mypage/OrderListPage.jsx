import React, { useState, useEffect } from "react";
import { useOrder } from "../../hooks/useOrder";
import "../../assets/css/OrderListPageStyle.css";
import { useNavigate } from "react-router";

function OrderListPage() {
  const navigate = useNavigate();
  const { getMyOrders } = useOrder();
  const { data: orders, isLoading } = getMyOrders();

  const [period, setPeriod] = useState("1개월");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    if (orders) {
      handlePeriodFilter(period); // 초기값 1개월 기준 필터링
    }
  }, [orders]);

  if (isLoading) return <p>로딩 중...</p>;

  //주문 상태별 개수 
  const countByStatus = (status) =>
    filteredOrders?.filter((o) => o.status === status).length || 0;

  // 기간 버튼 클릭 시 
  const handlePeriodFilter = (selected) => {
    setPeriod(selected);

    if (!orders?.length) return;

    const now = new Date();
    let months = 1;
    if (selected === "3개월") months = 3;
    if (selected === "6개월") months = 6;

    const start = new Date();
    start.setMonth(start.getMonth() - months);

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= start && orderDate <= now;
    });

    setFilteredOrders(filtered);
    setStartDate("");
    setEndDate("");
  };

  // 조회 버튼 클릭 시 (직접 날짜 입력 필터링)
  const handleDateSearch = () => {
    if (!startDate || !endDate) {
      alert("조회 기간을 모두 선택해주세요!");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= start && orderDate <= end;
    });

    setFilteredOrders(filtered);
    setPeriod(""); // 기간 버튼 해제
  };

  return (
    <div className="orderlist-container">
      <h2>주문/배송 조회</h2>
      <div className="status-box">
        {["주문접수", "결제완료", "배송준비중", "배송중", "배송완료"].map(
          (label, idx) => (
            <div className="status-item" key={idx}>
              <h3>{countByStatus(label)}</h3>
              <p>{label}</p>
            </div>
          )
        )}
      </div>
      <div className="filter-box">
        <div className="period-buttons">
          {["1개월", "3개월", "6개월"].map((p) => (
            <button
              key={p}
              className={period === p ? "active" : ""}
              onClick={() => handlePeriodFilter(p)}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="date-range">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button className="search-button" onClick={handleDateSearch}>
            조회
          </button>
        </div>
      </div>
      <div className="order-table">
        <div className="table-header">
          <div>구매 날짜</div>
          <div>구매한 상품명</div>
          <div>수량</div>
          <div>가격</div>
          <div>배송 상태</div>
          <div>기능</div>
        </div>

        {filteredOrders?.length ? (
          filteredOrders.map((order) => (
            <div className="table-row" key={order.orderId}>
              <div>{new Date(order.orderDate).toLocaleDateString("ko-KR")}</div>
              <div>
                {order.items?.map((i) => (
                  <p key={i.bookId || i.usedBookId}>
                    | {i.bookTitle}
                    {i.usedBookId && (
                      <span className="used-label" 
                      style={{color:'red'}}> (중고거래)</span>
                    )}{" "}
                    |
                  </p>
                ))}
              </div>
              <div>
                {order.items?.reduce((acc, i) => acc + i.quantity, 0)}개
              </div>
              <div>{order.totalPrice.toLocaleString()}원</div>
              <div>{order.status}</div>
              <div className="action-btns">
                <button
                  className="track-btn"
                  onClick={() =>
                    navigate("/mypage/ship", { state: { order } })
                  }
                >
                  배송 조회
                </button>
                <button
                  className="review-btn"
                  onClick={() =>
                    navigate("/mypage/create/review", { state: { order } })
                  }
                >
                  리뷰 쓰기
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty">주문 내역이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default OrderListPage;
