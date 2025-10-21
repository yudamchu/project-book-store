import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLogin, getUserInfo } from "../api/authAPI";
import { authStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { setLogin } = authStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials) => {
      try {
        // 로그인 API 호출
        const res = await postLogin(credentials);
        return res;

      } catch (error) {
        throw error.response?.data || error;
      }
    },

   /* 캐시 무효화 이슈로 바로 데이터 초기화 안됨
   onSuccess: async (data) => {
        console.log("로그인 성공:", data);

     
        //토큰 먼저 저장 (axios 인터셉터에서 바로 사용 가능)
        const token = data.token;
        setLogin({}, token);

        //이제 '/me' 호출 시 Authorization 자동으로 붙음
        const user = await getUserInfo();

        // 유저 정보로 상태 갱신
        setLogin(user, token);


        // React Query 캐시 무효화 (유저 관련 데이터 새로고침 대비)
        queryClient.invalidateQueries({ queryKey: ["users"] });

        // 페이지 이동
        navigate("/");
    },*/

    onSuccess: async (data) => {
      console.log("로그인 성공:", data);

      const token = data.token;

      // 토큰 먼저 저장
      setLogin(null, token);

    try {
      // 토큰 기반으로 사용자 정보 조회
      const user = await getUserInfo();

      // 유저 정보 + 토큰 최종 저장
      setLogin(user, token);

      // 캐시 무효화
      queryClient.invalidateQueries(["users"]);

      // 메인 페이지 이동
      navigate("/");

  } catch (err) {
    console.error("유저 정보 불러오기 실패:", err);
    alert("로그인은 성공했지만 사용자 정보를 불러오지 못했습니다.");
  }
},

    onError: (error) => {
      console.error("로그인 실패:", error);
      alert("로그인 실패: 아이디/비밀번호를 확인하세요.");
    },
  });
};
