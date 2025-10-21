import { useOrder } from "../../hooks/useOrder";
import { usePayment } from "../../hooks/usePayment";
import "../../assets/css/AdminOrderPageStyle.css";
import { useUsedBook } from "../../hooks/useUsedBook";
import { getAllMembers } from "../../hooks/useMember";

function AdminOrderPage() {
  const { getAllOrders, updateStatus } = useOrder();
  const { getAllPayments, updatePaymentStatus } = usePayment();

  const { data: orders, isLoading: orderLoading } = getAllOrders();
  const { data: payments, isLoading: paymentLoading } = getAllPayments();

  const { mutate: updateOrderStatus } = updateStatus();
  const { mutate: updatePayStatus } = updatePaymentStatus();


  const { data: members} = getAllMembers();

  //중고 책 리스트 요청
  const {getBookList} = useUsedBook();
  const { data: usedBooks } = getBookList();

  //중고거래 성사된 판매자 ID 찾기 
  const findSeller = (id) => {
    const found = usedBooks?.content.find((u) => u.usedBookId === id);
    let userId =  found ? found.sellerId : null;
    const member = members?.find((m) => m.userId === userId);
    return member ? member.username || member.name : "알 수 없음";
  };


  if (orderLoading || paymentLoading) return <p>로딩 중...</p>;

  // 결제 상태 매핑
  const getPaymentStatus = (paymentId) => {
    const payment = payments?.find((p) => p.paymentId === paymentId);
    return payment ? payment.status : "-";
  };

  // 주문 상태 변경
  const handleOrderStatusChange = (order) => (e) => {
    const newStatus = e.target.value;
    updateOrderStatus(
      { orderId: order.orderId, status: newStatus },
      {
        onSuccess: () => {
          if (newStatus === "취소" && order.paymentId) {
            updatePayStatus(
              { paymentId: order.paymentId, status: "취소" },
              {
                onSuccess: () =>
                  console.log(`결제(${order.paymentId}) 자동 취소 완료`),
              }
            );
          }
        },
      }
    );
  };

  // 결제 상태 변경
  const handlePaymentStatusChange = (order) => (e) => {
    const newStatus = e.target.value;

    if (!order.paymentId) {
      alert("결제 ID가 없습니다.");
      return;
    }

    updatePayStatus(
      { paymentId: order.paymentId, status: newStatus },
      {
        onSuccess: () => {
          if (newStatus === "취소" && order.orderId) {
            updateOrderStatus(
              { orderId: order.orderId, status: "취소" },
              {
                onSuccess: () =>
                  console.log(`주문(${order.orderId}) 자동 취소 완료`),
              }
            );
          }
        },
      }
    );
  };

  return (
    <div className="admin-order-container">
      <h2>📦 주문 / 배송 관리</h2>

      <table className="admin-order-table">
        <thead>
          <tr>
            <th>주문번호</th>
            <th>회원명</th>
            <th>주문일</th>
            <th>상품명</th>
            <th>총 금액</th>
            <th>배송 상태</th>
            <th>결제 상태</th>
          </tr>
        </thead>
        <tbody>
          {orders?.length ? (
            orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.username}</td>
                <td>
                  {new Date(order.orderDate).toLocaleString("ko-KR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
                <td>
                  {order.items?.map((i) => (
                    <p key={i.bookId || i.usedBookId}>
                      {i.bookTitle}
                      {i.usedBookId && (
                        <>
                        <span className="used-label" style={{color: 'red'}}> (중고거래)</span>
                        {findSeller(i.usedBookId) && (
                          <span className="seller-info" style={{color: 'red'}}>
                          {" "}
                          👉 {findSeller(i.usedBookId)} 님에게 포인트 충전 필요
                          </span>
                        )}
                      </>
                    )}
                    </p>
                  ))}
                </td>
                <td>{order.totalPrice.toLocaleString()}원</td>

                <td>
                  <select
                    value={order.status}
                    onChange={handleOrderStatusChange(order)}
                    className={`status-select ${
                      order.status === "취소" ? "cancel" : ""
                    }`}
                  >
                    <option value="결제완료">결제완료</option>
                    <option value="배송중">배송중</option>
                    <option value="완료">완료</option>
                    <option value="취소">취소</option>
                  </select>
                </td>

                <td>
                  <select
                    value={getPaymentStatus(order.paymentId)}
                    onChange={handlePaymentStatusChange(order)}
                    className={`status-select ${
                      getPaymentStatus(order.paymentId) === "취소" ? "cancel" : ""
                    }`}
                  >
                    <option value="성공">성공</option>
                    <option value="실패">실패</option>
                    <option value="취소">취소</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="empty">
                주문 내역이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrderPage;
