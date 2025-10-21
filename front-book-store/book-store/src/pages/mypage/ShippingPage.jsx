import React from 'react';
import { useLocation } from 'react-router';
import '../../assets/css/ShippingPageStyle.css';

function ShippingPage() {
  const location = useLocation();
  const order = location.state?.order; 

  if (!order) return <p>주문 정보를 불러올 수 없습니다.</p>;

  return (
    <div className="ship-container">
      <h2>📦 배송 조회</h2>
      <div className="ship-section product-info">
        <h3>주문 상품</h3>
        <div className="product-list">
          {order.items?.map((item, idx) => (
            <div key={idx} className="product-item">
              <p className="product-title">{item.bookTitle}</p>
              <p className="product-qty">{item.quantity}개</p>
            </div>
          ))}
        </div>
        <p className="product-total">
          총 {order.items?.length || 0}건 /{" "}
          {order.totalPrice?.toLocaleString()}원
        </p>
      </div>
      <div className="ship-section">
        <h3>배송지 정보</h3>
        <div className="address">
          <p>{order.address}</p>
          <p>{order.addressDetail}</p>
        </div>
      </div>
      <div className="ship-section">
        <h3>수령인</h3>
        <div className="receiver">
          <p>{order.receiverName}</p>
          <p>{order.receiverPhone}</p>
        </div>
      </div>
      <div className="ship-section status">
        <h3>배송 상태</h3>
        <p className="order-status">{order.status}</p>
      </div>
    </div>
  );
}

export default ShippingPage;

