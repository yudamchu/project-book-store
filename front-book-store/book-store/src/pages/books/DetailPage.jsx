import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useBook } from '../../hooks/useBook';
import { useBookImage } from '../../hooks/useBookImage';
import '../../assets/css/DetailPageStyle.css'
import BookDescription from '../../components/BookDescription';
import Review from '../../components/Review';
import ExchangeInfo from '../../components/ExchangeInfo';
import { useCart } from '../../hooks/useCart';
import { authStore } from '../../store/authStore';

function DetailPage(props) {
   
    const isLogin = authStore(state => state.isLogin)
    const navigate = useNavigate();
    
    //도서 상세 정보 가저오기
    const location = useLocation();
    const {bookId} = location.state;

    const {getBookDetail} = useBook();
    const {data: book, isLoading, isError} = getBookDetail(bookId);

    //해당 도서 이미지 가져오기
    const {getBookImage} = useBookImage();
    const {data: image} = getBookImage(bookId);

    //수량 변경
    const [count, setCount] = useState(1); 

    //장바구니 추가 요청
    const {addItem} = useCart();
    const {mutate: addMutate} = addItem();


    //1이면 -버튼 disabled
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(()=> {

        if(count <=1){
            setIsDisabled(true);
        }
    }, [count])
    

    //책 설명/리뷰/반품교환문의 탭
    const [tapKey, setTapKey] = useState(0);
    const infoTap = [
        {
            name: '상세 정보',
            component: <BookDescription book={book}/>
        }, 
        {
            name: '리뷰',
            component: <Review bookId={bookId}/>
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


    //장바구니 버튼 클릭시
    const addItemBtn = (bookId, count) => {

        //로그인 안되어 있으면 로그인으로 
       if(!isLogin){
         navigate('/login');
       }else{
        const quantity = count;
        addMutate({bookId, quantity});
       }
    }

    //주문하기 버튼 클릭시 
    const orderBtn = () => {
        //로그인 안되어 있으면 로그인으로 
       if(!isLogin){
         navigate('/login');
       }else{
        navigate('/order', {state: {book, quantity:count}});
       }
    }

   


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
                    <p>저자: {book.author}</p>
                    <p>출판: {book.publisher}</p>
                    <p>발행일: {book.publishedDate}</p>
                </div>
                <div className='price'>{book.price.toLocaleString()} 원</div>
                <div className='quant'>
                    <label>수량</label>
                    <button type='button' onClick={()=> setCount((prev) => prev-1)} disabled={isDisabled}>-</button>
                    <span>{count}</span>
                    <button type='button' onClick={()=> setCount((prev)=> prev+1)}>+</button>
                </div>
                <div className='info'>
                    <p>배송정보</p>
                    <p>2,500원 (30,000원 이상 구매시 무료배송)</p>
                    <p>평균 3일 이내 배송</p>
                </div>
                <div className='btn-box'>
                    <button type='button' className='wish-btn' onClick={() => addItemBtn(book.bookId, Number(count))}>장바구니</button>
                    <button type='button' className='order-btn' onClick={orderBtn}>주문하기</button>
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

export default DetailPage;