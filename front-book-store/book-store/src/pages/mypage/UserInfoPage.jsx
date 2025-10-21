import React, { useState } from "react";
import { authStore } from "../../store/authStore";
import { updateMember, withdrawMember } from "../../hooks/useMember" 
import '../../assets/css/UserInfoPageStyle.css'

function UserInfoPage() {
  // 전역 상태에서 사용자 정보 가져오기
  const user = authStore((state) => state.user);


  const [newInfo, setNewInfo] = useState({
    name: user.name || "",
    phone: user.phone || "",
    username: user.username || "",
  });

  // 훅 호출 
  const updateMutation = updateMember();
  const withdrawMutation = withdrawMember();

  // input 변경  될 시
  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setNewInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 회원 정보 수정 버튼 클릭 시
  const saveInfoBtn = () => {
    if (confirm("변경된 회원 정보를 저장하시겠습니까?")) {
      updateMutation.mutate(newInfo); 
    }
  };

  // 회원 탈퇴 버튼 클릭 시
  const withdrawBtn = () => {
    if (confirm("정말 탈퇴하시겠습니까?")) {
      withdrawMutation.mutate(); 
    }
  };

  return (
    <>
      <div className="user-info-container">
        <h2>회원 정보</h2>
        <div className="user-info-box">
          <label>
            이름
            <input
              type="text"
              name="name"
              value={newInfo.name}
              onChange={handleOnchange}
            />
          </label>
          <label>
            전화번호
            <input
              type="text"
              name="phone"
              value={newInfo.phone}
              onChange={handleOnchange}
            />
          </label>
          <label>
            아이디
            <input
              type="text"
              name="username"
              value={newInfo.username}
              onChange={handleOnchange}
              readOnly
            />
          </label>
        </div>
        <button type="button" className="update-btn" onClick={saveInfoBtn}>
          회원 정보 저장
        </button>
        <button type="button" className="withdraw-btn" onClick={withdrawBtn}>
          회원 탈퇴
        </button>
      </div>
    </>
  );
}

export default UserInfoPage;
