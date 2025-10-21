import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Dropdown = styled.ul`
  position: absolute;
  top: 60px;
  right: 10px;
  width: 200px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 8px 0;
  z-index: 100;
  animation: fadeIn 0.2s ease-in;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Item = styled.li`
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background 0.2s;

  &:hover {
    background-color: #f5f5f5;
    color: rgb(117, 77, 211);
  }
`;

function MypageDropDown({isLeave}) {
  const navigate = useNavigate();
  return (
    <Dropdown onMouseLeave={isLeave}>
      <Item onClick={() => navigate("/mypage")}>회원 정보 관리</Item>
      <Item onClick={() => navigate("/mypage/address")}>배송지 관리</Item>
      <Item onClick={() => navigate("/mypage/order/list")}>주문/배송 조회</Item>
      <Item onClick={() => navigate("/mypage/reviews")}>리뷰 관리</Item>
      <Item onClick={() => navigate("/mypage/point")}>포인트 관리</Item>
      <Item onClick={() => navigate("/mypage/usedbooks")}>중고 거래 관리</Item>
    </Dropdown>
  );
}

export default MypageDropDown;
