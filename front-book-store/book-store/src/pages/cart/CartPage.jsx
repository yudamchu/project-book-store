import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import '../../assets/css/CartPageStyle.css'
import BookImage from '../../components/BookImage';
import { useNavigate } from 'react-router';

function CartPage(props) {
    
   
    //장바구니 관련 요청
    const { getCart, deleteItem, updateItem, clearCart } = useCart();
    const {data: cart, isLoading, isError} = getCart();

    const { mutate: deleteMutate } = deleteItem();
    const {mutate: updateMutate} = updateItem();
    const {mutate: clearMutate} = clearCart();

    // 개별 상품 수량 상태 관리 (로컬)
    const [quant, setQuant] = useState({})
   
    const navigate = useNavigate();

    if(isLoading) return <p>...로딩중</p>;
    if(isError) return <p>에러 발생 </p>;
        
    // 수량 변경 핸들러
    const handleChange = (cartItemId, value) => {
        setQuant((prev) => ({
            ...prev,
            [cartItemId]: value,
        }));
    };

    //수량 증가
    const increaseBtn = async(cartItemId, stock, currentQuant) => {
        

         if(currentQuant > stock){
            alert('재고가 부족합니다.');
         }else{
            const newQty = currentQuant + 1;
            setQuant((prev) => ({ ...prev, [cartItemId]: newQty }));
            updateMutate({ cartItemId, quantity: newQty });
         }
    };


    //수량 감소
    const decreaseBtn = (cartItemId, currentQuant) => {
    

        if(currentQuant <= 1){
            confirm('해당 제품을 장바구니에서 삭제하시겠습니까?') && deleteItem(cartItemId);
        }else{
            const newQty = currentQuant-1;
            setQuant((prev) => ({ ...prev, [cartItemId]: newQty }));
            updateMutate({ cartItemId, quantity: newQty });
        }
    }

    console.log(cart);

    const cartId = cart.cartId;
    return (
        <div className='cart-container'>
            <h2>장바구니</h2>
            <table className='item-container'>
                <thead>
                    <tr>
                        <th>상품</th>
                        <th>수량</th>
                        <th>가격</th>
                        <th>선택</th>
                    </tr>
                </thead>
                <tbody>
            {
                
                cart?.items.length? cart.items.map(x => (
                    <tr className='cart-item' key={x.cartItemId}>
                        <td className="book-info">
                            <BookImage bookId={x.bookId} title={x.bookTitle} />
                            <p>{x.bookTitle}</p>
                        </td>
                        <td>
                            <button type='button' className='quant-btn' onClick={() => decreaseBtn(x.cartItemId, x.quantity)}>-</button>
                            <input
                                type="number"
                                value={quant[x.cartItemId] ?? x.quantity}
                                onChange={(e) =>
                                    handleChange(x.cartItemId, Number(e.target.value))
                                }
                                min="1"
                            />
                            <button type='button' className='quant-btn' onClick={()=>increaseBtn(x.cartItemId, x.stock, x.quantity)}>+</button>
                        </td>
                        <td>{x.price}</td>
                        <td>
                            <button type='button' className='det-btn' onClick={()=>deleteMutate(x.cartItemId)}>X</button>
                        </td>
                    </tr>
                )) 
                :
                <p style={{padding: 20}}>장바구니가 비어있습니다.</p>
            }
            </tbody>
            </table>
            <div className='btn-container'>
                <button type='button' className='total-del-btn' onClick={()=>clearMutate()}>전체 상품 삭제</button>
                <button type='button' className='pay-btn' onClick={()=>navigate('/order', {state: {cartId, quantities: quant}})}>주문 하기</button>
            </div>
        </div>
    );
}

export default CartPage;