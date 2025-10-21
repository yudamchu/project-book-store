import React, { useEffect, useState } from 'react';
import { useAddress } from '../../hooks/useAddress';
import { useCart } from '../../hooks/useCart';
import { useLocation, useNavigate } from 'react-router';
import '../../assets/css/OrderPageStyle.css';
import { useOrder } from '../../hooks/useOrder';
import BookImage from '../../components/BookImage';
import { usePoint } from '../../hooks/usePoint';

function Order() {

  //장바구니 및 상세페이지에서 넘어온 state 추출
  const navigate = useNavigate();
  const location = useLocation();
  const { cartId, book, quantity, quantities, usedBookId } = location.state || {};

  
  //주소 요청
  const { getAddressList } = useAddress();
  const { data: addresses, isLoading: addrLoading } = getAddressList();

  //장바구니 요청
  const { getCart } = useCart();
  const { data: cart, isLoading: cartLoading } = getCart();

  //주문 관련 요청
  const { createOrder, createFromCart } = useOrder();
  const { mutate: orderMutate } = createOrder();
  const { mutate: cartOrderMutate } = createFromCart();

  //포인트 요청
  const { getMyPoints } = usePoint();
  const { data: points } = getMyPoints();

  
  //주소선택 상태
  const [selectedAddress, setSelectedAddress] = useState(null);
  //도서 수량 상태
  const [bookQuantity, setBookQuantity] = useState(quantity || 1);

  if (addrLoading || cartLoading) return <p>로딩 중...</p>;

  
  // 장바구니 총액 계산 (전달된 quantities 반영)
  const currentBalance = points?.[0]?.balance ?? 0;

  const cartTotal =
    cartId && cart?.items
      ? cart.items.reduce((acc, item) => {
          const selectedQuantity = quantities?.[item.cartItemId] ?? item.quantity;
          return acc + item.price * selectedQuantity;
        }, 0)
      : 0;

  const totalPrice = book ? book.price * bookQuantity : cartTotal;

  
  //주문하기 버튼 클릭시
  const handleOrder = () => {
    if (!selectedAddress) return alert('배송지를 선택하세요.');
    if (currentBalance < totalPrice)
      return alert('포인트가 부족합니다! 충전 후 결제해주세요.');

    
    if (book) {
      const body = {
        
        addressId: selectedAddress,
        items: [
          {
            bookId: book.bookId ?? null,    // 일반 도서일 수도 있음
            usedBookId: usedBookId ?? null, // 중고 도서일 경우
            quantity: bookQuantity,
            price: book.price,
          },
        ],
      };

      orderMutate(body);

    }else if (cartId) {
      cartOrderMutate(
        { cartId, addressId: selectedAddress }
      );
    }
  };

  return (
    <div className="order-container">
      <h2>주문 페이지</h2>
      <section className="address-select">
        <h3>배송지 및 주문자 정보 선택</h3>
        <select onChange={(e) => setSelectedAddress(Number(e.target.value))} defaultValue="">
          <option value="" disabled>
            배송지 및 주문자 정보를 선택하세요
          </option>
          {addresses?.map((addr) => (
            <option key={addr.addressId} value={addr.addressId}>
              {addr.receiverName} | {addr.receiverPhone} | {addr.address} {addr.addressDetail}
            </option>
          ))}
        </select>
      </section>
      <section className="order-items">
        <table className="order-table">
          <thead>
            <tr>
              <th>상품 이미지</th>
              <th>상품명</th>
              <th>수량</th>
              <th>가격</th>
              <th>상품금액</th>
            </tr>
          </thead>
          <tbody>
            {book ? (
              <tr>
                <td>
                  <BookImage bookId={book.bookId} title={book.title} />
                </td>
                <td>{book.title}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={bookQuantity}
                    onChange={(e) => setBookQuantity(Number(e.target.value))}
                  />
                </td>
                <td>{book.price.toLocaleString()}원</td>
                <td>{(book.price * bookQuantity).toLocaleString()}원</td>
              </tr>
            ) : (
              cart?.items?.map((item) => {
                const selectedQuantity = quantities?.[item.cartItemId] ?? item.quantity;
                return (
                  <tr key={item.cartItemId}>
                    <td>
                      <BookImage bookId={item.bookId} title={item.bookTitle} />
                    </td>
                    <td>{item.bookTitle}</td>
                    <td>{selectedQuantity}</td>
                    <td>{item.price.toLocaleString()}원</td>
                    <td>{(item.price * selectedQuantity).toLocaleString()}원</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>
      <div className="total-box">
        <p>
          총 결제 금액 :
          <strong>{totalPrice.toLocaleString()}원</strong>
        </p>
        <p>현재 보유 포인트: {currentBalance.toLocaleString()}P</p>
        <button type="button" onClick={handleOrder}>
          결제하기
        </button>
      </div>
    </div>
  );
}

export default Order;
