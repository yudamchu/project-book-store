import { useNavigate } from 'react-router-dom';


function MyPageMenu(props) {
    const navigate = useNavigate();
    return (
        <>
          <div className='mypage-menu'>
            <h3>마이 페이지</h3>
            <ul>
              <li onClick={()=> navigate('/mypage')} >회원 정보 관리</li>
              <li onClick={()=> navigate('/mypage/address')}>배송지 관리</li>
              <li onClick={()=> navigate('/mypage/order/list')}>주문/배송 조회</li>
              <li onClick={()=> navigate('/mypage/reviews')}>리뷰 관리</li>
              <li onClick={()=> navigate('/mypage/point')}>포인트 관리</li>
              <li onClick={()=> navigate('/mypage/usedbooks')}>중고 거래 관리</li>
            </ul>
          </div>  
        </>
    );
}

export default MyPageMenu;