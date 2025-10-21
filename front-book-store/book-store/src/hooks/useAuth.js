//React Query custom hook
//회원가입 탈퇴 mutation 처리

import { useMutation } from "@tanstack/react-query";
import { postJoin } from "../api/authAPI";
import { withdrawUser } from "../api/authAPI";
import { authStore } from "../store/authStore";

export const useAuth = () => {

  // 회원가입 Mutation
  const joinMutation = useMutation({
    mutationFn: async (data) => {
      try {
        const res = await postJoin(data);
        return res;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    onSuccess: (data) => {
      console.log("회원가입 성공:", data);
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      window.location.href = "/login";
    },
    onError: (error) => {
      console.error("회원가입 실패:", error);
      alert("회원가입 실패: 아이디가 중복되었거나 입력 정보를 확인하세요.");
    },
  });

  // 회원탈퇴 Mutation
  const withdrawMutation = useMutation({
    mutationFn: async (username) => {
      try {
        const res = await withdrawUser(username);
        return res;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    onSuccess: (data) => {
      console.log("회원탈퇴 성공:", data);
      
      authStore.getState().setLogout();
      localStorage.removeItem("auth-storage");
      
      window.location.href = "/";
    },

    onError: (error) => {
      console.error("회원탈퇴 실패:", error);
      alert(error.message || "회원탈퇴 중 오류가 발생했습니다.");
    },
  });

  return { joinMutation, withdrawMutation };
};

export default useAuth;
