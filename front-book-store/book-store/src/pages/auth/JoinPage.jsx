import React,{useState} from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../../assets/css/JoinPageStyle.css";
import {useAuth} from "../../hooks/useAuth";
import { checkUsername } from "../../api/authAPI";
import { useNavigate } from "react-router-dom";

//1. yup 스키마 작성
const schema = yup.object().shape({
  name: yup.string().required("이름은 필수 입력 사항입니다."),
  phone: yup
    .string()
    .required("휴대폰 번호는 필수 입력 사항입니다.")
    .matches(/^01([0|1|6|7|8|9]?)([0-9]{3,4})([0-9]{4})$/, "올바른 휴대폰 번호 형식이 아닙니다."),
  username: yup
    .string()
    .required("아이디는 필수 입력 사항입니다.")
    .matches(/^[A-Za-z0-9]+$/, "아이디는 영문과 숫자만 가능합니다"),
  password: yup
    .string()
    .required("비밀번호는 필수 입력 사항입니다.")
    .min(4, "비밀번호는 최소 4자 이상 입력해야 합니다.")
    .max(20, "비밀번호는 최대 20자 이하로 입력해야 합니다.")
    .matches(/^[0-9]+$/, "비밀번호는 숫자만 입력 가능합니다."),
  confirmPassword: yup
    .string()
    .required("비밀번호 확인은 필수 입력 사항입니다.")
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다."),
});

function JoinPage() {

    const navigate = useNavigate();
    const [isAvailable, setIsAvailable] = useState(false); //아이디 중복확인 상태
    const [message, setMessage] = useState(""); //아이디 중복확인 메시지

    //2. useForm 훅 사용
    const { register, handleSubmit, watch, formState: { errors }} = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    //회원가입 버튼 클릭시
    const {joinMutation} = useAuth();

    const handleJoin = (data) => {

      if(!isAvailable){
        return alert("아이디 중복 확인을 해주세요.");
      }
      
      const payload = {
          username: data.username,
          password: data.password,
          name: data.name,
          phone: data.phone,
      };
        joinMutation.mutate(payload);
    
    };

    //아이디 중복 확인 버튼 클릭시
    const idCheckBtn = async () => {
        const username = watch("username"); //폼 입력값을 실시간으로 관찰(watch)하는 함수
    
        if (!username) return alert("아이디를 입력해주세요.");
        
        try {
            const res = await checkUsername(username);
            
            if(res.exists){
              setIsAvailable(false)
            }else{
              setIsAvailable(true)
            }
            setMessage(res.message);
            console.log(isAvailable);

        } catch (err) {
            console.error(err);
            
        }
    };

  return (
    <div className="join-container">
      <h1>
        <a className="logo">LinkBook</a> 회원 가입
      </h1>
      <form className="join-form" onSubmit={handleSubmit(handleJoin)}>
        <label htmlFor="name">
          이름
          <input type="text" id="name" placeholder="이름을 입력하세요" {...register("name")} />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </label>

        <label htmlFor="phone">
          휴대폰 번호
          <input
            type="text"
            id="phone"
            placeholder="'-' 없이 입력하세요 (예: 01012345678)"
            {...register("phone")}
          />
          {errors.phone && <p className="error-message">{errors.phone.message}</p>}
        </label>

        <label htmlFor="username">
          아이디
          <div className="id-check-container">
            <input
              type="text"
              id="username"
              placeholder="영문 아이디를 입력하세요"
              {...register("username")}
            />
            <button type="button" className="id-check" onClick={idCheckBtn}>
              중복 확인
            </button>
          </div>
          {errors.username && <p className="error-message">{errors.username.message}</p>}
          {message && <p className={isAvailable ? "success-message" : "error-message"}>{message}</p>}
        </label>
        <label htmlFor="password">
          비밀번호
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력하세요(숫자 4~20자)"
            {...register("password")}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </label>

        <label htmlFor="confirmPassword">
          비밀번호 확인
          <input
            type="password"
            id="confirmPassword"
            placeholder="비밀번호를 다시 입력하세요"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword.message}</p>
          )}
        </label>
        <button type="submit" className="join-btn">
          {joinMutation.isLoading ? "처리 중" : "회원가입"}
        </button>
        <button type="button" className="join-btn" onClick={()=> navigate('/login')}>로그인으로 이동</button>
      </form>
    </div>
  );
}

export default JoinPage;
