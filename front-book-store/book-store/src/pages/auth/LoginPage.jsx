import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/LoginPageStyle.css';
import { useLogin } from '../../hooks/useLogin';

function LoginPage(props) {

    const [id, setId] = useState('');
    const [pwd, setPwd] = useState('');

    const navigate = useNavigate();

    const loginMutation = useLogin();


    // 로그인 처리
    const handleLogin = (e) =>{
        e.preventDefault();
        if (!id.trim() || !pwd.trim()) {
            alert("아이디와 비밀번호를 입력하세요");
            return;
        }

        loginMutation.mutate({ username: id, password: pwd });
    };

    // 회원가입 페이지로 이동
    const handleJoin = () =>{
        navigate('/signup');
    };

    return (
        <>
           <div className='login-container'>
                <h2>로그인</h2>
            <form  className='login-form' onSubmit={handleLogin}>
                <label htmlFor='userId'>아이디</label>
                <input type="text" name='userId' id='userId' 
                    placeholder="아이디를 입력하세요" 
                    onChange={(e) => setId(e.target.value)} 
                />
                <label htmlFor='passwd'>비밀번호</label>
                <input type="password" name='passwd' id='passwd' 
                    placeholder="비밀번호를 입력하세요(숫자)" 
                    onChange={(e) => setPwd(e.target.value)} 
                />
                <button type='submit' className='loginBtn'>로그인</button>
            </form>
                <button type='button' className='joinBtn' onClick={handleJoin}>회원가입</button>
           </div> 
        </>
    );
}

export default LoginPage;