import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberAPI } from "../api/memberAPI";
import { authStore } from "../store/authStore";

/* ------------------------------ QUERY ------------------------------ */

// 관리자 전용: 전체 회원 조회
export const getAllMembers = () => {
  const user = authStore((s) => s.user);

  return useQuery({
    queryKey: ["members"],
    queryFn: memberAPI.getAll,
    enabled: !!user && user.role === "ADMIN",
  });
};

// 단일 회원 조회 (일반/관리자 공용)
export const getMember = () => {
  const user = authStore((s) => s.user);

  return useQuery({
    queryKey: ["member", user?.userId],
    queryFn: () => memberAPI.get(user.userId),
    enabled: !!user?.userId,
  });
};

/* ---------------------------- MUTATIONS ---------------------------- */

// 일반 사용자: 본인 정보 수정
export const updateMember = () => {
  const user = authStore((s) => s.user);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => memberAPI.update(user.userId, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries(["member", user.userId]);
      const state = authStore.getState();
      state.updateUser(variables);
      alert("회원 정보가 수정되었습니다.");
    },
    onError: (err) => {
      console.error(err);
      alert("회원 정보 수정 실패");
    },
  });
};

// 관리자: 특정 회원 정보 수정
export const adminUpdateMember = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }) => memberAPI.adminUpdate(userId, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries(["members"]);
      const state = authStore.getState();
      state.updateUser(variables);
      alert("관리자가 회원 정보를 수정했습니다.");
    },
    onError: (err) => {
      console.error(err);
      alert("관리자 회원 정보 수정 실패");
    },
  });
};

// 관리자: 회원 삭제
export const adminDeleteMember = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (userId) => memberAPI.deleteByAdmin(userId),
    onSuccess: () => {
      qc.invalidateQueries(["members"]);
      alert("회원이 삭제되었습니다.");
    },
    onError: (err) => {
      console.error(err);
      alert("회원 삭제 실패");
    },
  });
};

// 일반 사용자: 회원 탈퇴
export const withdrawMember = () => {
  const user = authStore((s) => s.user);

  return useMutation({
    mutationFn: () => memberAPI.withdraw(user.userId),
    onSuccess: () => {
      alert("회원 탈퇴가 완료되었습니다.");
      authStore.getState().setLogout();
      localStorage.removeItem("auth-storage");
      window.location.href = "/";
    },
    onError: (err) => {
      console.error(err);
      alert("회원 탈퇴 실패");
    },
  });
};
