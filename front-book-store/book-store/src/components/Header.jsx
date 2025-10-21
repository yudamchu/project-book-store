import React, {useState} from 'react';
import { authStore } from '../store/authStore';
import '../assets/css/HeaderStyle.css';
import { useNavigate } from 'react-router-dom';
import MypageDropDown from './MypageDropDown';
import CategoriesMenu from './CategoriesMenu';
import { IoMenu } from "react-icons/io5";
import { useBook } from '../hooks/useBook';

function Header(props) {

    
    const navigate = useNavigate();
    const isLogin = authStore((state) => state.isLogin);
    const userInfo = authStore((state) => state.user);

    console.log(userInfo);
    
    //마이페이지 메뉴 드롭다운 상태 저장
    const [mypageDrop, setMypageDrop] = useState(false);
    const [isLeave, setIsLeave] = useState(false);

    const [categoryDrop, setCategoryDrop] = useState(false);

   
    
    const [searchInput, setSearchInput] = useState('');

    //검색을 위한 데이터
    //도서 정보 가져오기
      const { getBookList } = useBook();
      const { data: books, isLoading, isError } = getBookList();
    
    
    
      if (isLoading) return <div>📚 도서 목록을 불러오는 중...</div>;
      if (isError) return <div>❌ 데이터를 불러오는 중 오류가 발생했습니다.</div>;
      if (!books?.content?.length) return <div>📭 등록된 도서가 없습니다.</div>;


    //검색버튼 클릭시
    const searchBtn = () => {
        if(!searchInput.trim()){
            alert('검색어를 입력하세요');
            return
        };

        const keyword = searchInput.trim().toLowerCase();
        const result = books.content.filter(
            (b) =>
                b.title.toLowerCase().includes(keyword) ||
                b.author.toLowerCase().includes(keyword) ||
                b.publisher.toLowerCase().includes(keyword)
            );

        if (!result || result.length === 0) {
            alert("검색 결과가 없습니다.");
        };

        setSearchInput('');
        navigate('/search', { state: { result } });
    }

    //로그인 버튼 클릭시 로그인 페이지로 이동
    const loginBtn = () => {
        navigate('/login');
    }

    //로그아웃 버튼 클릭시
    const logoutBtn = () =>{

        if(!confirm('정말 로그아웃 하시겠습니까?')){
            return;
        }

        authStore.getState().setLogout();
        localStorage.removeItem("auth-storage");
        navigate('/');
        alert("로그아웃 되었습니다.");
    }

    //마이페이지 드롭다운
    const dropBtn = () =>{
        setMypageDrop((prev)=>!prev);
        setIsLeave(true);
    }

    return (
        <>
           <header className='header'>
               <div className='logo-container'>
                    <h1 onClick={()=> navigate('/')}>LinkBook</h1>
               </div>
               <div className='search-container'>
                    <input className='search-input' 
                        type='text' 
                        value={searchInput} 
                        placeholder='읽고 싶은 도서를 검색하세요.'
                        onChange={(e)=> setSearchInput(e.target.value)}/>
                    <button type='button' className='search-btn' onClick={searchBtn}>🔍</button>
               </div>
               <div className='user-container'>
                {
                    isLogin ? (
                        userInfo.role === "ADMIN" ? (
                            <>
                                <button type='button' className='login-btn' onClick={logoutBtn}>로그아웃</button>
                                <button type='button' className='login-btn' onClick={() => navigate('/admin')}>관리자 페이지</button>
                            </>
                        ) : (
                            <>
                                <button type='button' className='login-btn' onClick={logoutBtn}>로그아웃</button>
                                <button type='button' className='cart-btn' onClick={()=> navigate('/cart')}>🛒</button>
                                <button
                                    type='button'
                                    className='mypage-btn'
                                    onClick={dropBtn}
                                >
                                👤
                                </button>
                                {mypageDrop&&isLeave ? <MypageDropDown isLeave={()=> setIsLeave(false)}/> : null}
                            </>
                        )
                    ) : (
                        <button type='button' className='login-btn' onClick={loginBtn}>로그인</button>
                    )   
                }
            </div>
           </header>
           <div className='nav-container'>
                    <nav className='nav'>
                        <ul className='nav-list'>
                            <li id='first-menu' 
                                onClick={()=> setCategoryDrop((prev)=> !prev)}>
                                    <IoMenu/>
                            </li>
                            <div id='second-menu'>
                                 <li className='nav-item' onClick={()=> navigate('/total')}>전체 도서</li>
                                <li className='nav-item' onClick={()=> navigate('/new')}>신규 도서</li>
                                <li className='nav-item' onClick={()=> navigate('/usedbooks')}>중고 도서</li>
                                <li className='nav-item' onClick={()=> navigate('/rank')}>이달의 독서 왕</li>
                            </div>
                        </ul>
                    </nav>
                    {
                        categoryDrop && 
                        <CategoriesMenu 
                            isDropDown={()=> setCategoryDrop(false)}
                        />
                    }
            </div>
        </>
    );
}

export default Header;