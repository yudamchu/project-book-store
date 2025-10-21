import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import '../../assets/css/DetailPageStyle.css'
import BookDescription from '../../components/BookDescription';
import ExchangeInfo from '../../components/ExchangeInfo';
import { useUsedBook } from '../../hooks/useUsedBook';
import { useUsedBookImage } from '../../hooks/useUsedBookImage';
import { authStore } from '../../store/authStore';

function usedBookDetail(props) {

    const navigate = useNavigate();
    const isLogin = authStore(state => state.isLogin);
   
    //도서 상세 정보 가저오기
    const location = useLocation();
    const {usedBookId} = location.state;

    const {getBookDetail} = useUsedBook();
    const {data: book, isLoading, isError} = getBookDetail(usedBookId);

    //해당 도서 이미지 가져오기
    const { getBookImage } = useUsedBookImage();
    const { data: image } = getBookImage(usedBookId, { enabled: !!usedBookId });

    //중고 도서일 경우 판매자는 본인 책 구매 방지
      const user = authStore(state => state.user);
      const userId = user? user.userId : null;
      const [isDisabled , setIsDisabled] = useState(false);
    
   
    //판매자일 경우 주문하기 버튼 disabled
    useEffect(() => {
        if (book && book.sellerId === userId) {
            setIsDisabled(true);
            alert("자신의 중고 도서는 구매할 수 없습니다.");
            return;
        } else {
            setIsDisabled(false);
        }
     }, [book, userId]);
  
     

    //책 설명/리뷰/반품교환문의 탭
    const [tapKey, setTapKey] = useState(0);
    const infoTap = [
        {
            name: '상세 정보',
            component: <BookDescription book={book}/>
        }, 
        {
            name: '반품/교환/문의',
            component: <ExchangeInfo/>
        }
    ];

    //대표이미지
    const mainImg = image?.find(x => x.sortOrder === 1);

    console.log("대표 이미지", mainImg);

    if (isLoading) return <div>상세 데이터 불러오는 중...</div>;
    if (isError) return <div>상세 데이터 로드 실패</div>;
    console.log(book);

   

    //결제 버튼 클릭시
    const paymentBtn = () => {
         //로그인 안되어 있으면 로그인으로 
       if(!isLogin){
         navigate('/login');
       }else{
          navigate('/order', { state: { book, usedBookId: book.usedBookId, quantity: 1 } });
       }
        
    };
    


    return (
        <div className='detail-container'>
            <section className='main-info'>
            <div className='img-conatiner'>
                <img
                    src={`http://localhost:9090${mainImg?.imageUrl}` || '/images/no_image.png'}
                    alt={book.title}
                    className="book-img"
                />
            </div>
            <div className='info-container'>
                <h2>{book.title}</h2>
                <div className='info'>
                    <p>판매자: {book.sellerName}</p>
                </div>
                <div className='price-box'>
                    <p className='price' 
                        style={{color:'gray', textDecoration:'line-through'}}
                    >
                    {book.originalPrice.toLocaleString()} 원
                    </p>
                    <p className='price' 
                        style={{color:'#7C3AED'}}>
                        {book.price.toLocaleString()} 원
                    </p>
                </div>
                <div className='info'>
                    <p>배송정보</p>
                    <p>LinkBook 검수 후 배송이 진행되며, 영업일 기준 최대 7일 이상 소요될 수 있습니다. 이용에 참고 부탁드립니다.</p>
                    <p>평균 5일 이내 배송</p>
                    <p>2,500원</p>
                </div>
                <div className='btn-box'>
                    <button type='button' className='order-btn' 
                        onClick={paymentBtn} disabled={isDisabled}>주문하기
                    </button>
                </div>
            </div>
            </section>
            <section className='detail-box'>
                <div className='tap-box'>
                {
                    infoTap?.map((tap, idx) => 
                        <div onClick={()=>setTapKey(idx)}>{tap.name}</div>
                    )
                }
                </div>
                <div className='tap-info'>
                    {infoTap[tapKey]?.component}
                </div>
            </section>
        </div>
    );
}

export default usedBookDetail;