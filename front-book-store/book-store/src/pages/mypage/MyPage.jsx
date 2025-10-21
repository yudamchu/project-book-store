import React from 'react';
import MyPageMenu from '../../components/MyPageMenu';
import { Outlet } from 'react-router-dom';
import '../../assets/css/MyPageStyle.css';

function MyPage(props) {
    return (
        <>
        <div className='mypage-container'>
            <div className='mypage-menu-bar'>
                <MyPageMenu/>
            </div>  
            <div className='mypage-content'>
                <Outlet/>
            </div>
        </div>
        </>
    );
}

export default MyPage;