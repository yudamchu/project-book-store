import React, { useState } from "react";
import {
  getAllMembers,
  adminUpdateMember,
  adminDeleteMember,
} from "../../hooks/useMember";
import "../../assets/css/AdminUserPageStyle.css";

function AdminUserPage() {
  const { data: members, isLoading, isError } = getAllMembers();
  const { mutate: updateMemberMutate } = adminUpdateMember();
  const { mutate: deleteMemberMutate } = adminDeleteMember();

  const [editUserId, setEditUserId] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState("");

  if (isLoading) return <p>회원 목록 불러오는 중...</p>;
  if (isError) return <p>회원 데이터를 불러오는데 실패했습니다.</p>;

  //수정 버튼 클릭 시
  const handleEdit = (member) => {
    setEditUserId(member.userId);
    setEditRole(member.role);
    setEditStatus(member.status);
  };

  //저장 버튼 클릭 시
  const handleSave = (userId) => {
    updateMemberMutate({
      userId,
      data: { role: editRole, status: editStatus },
    });
    setEditUserId(null);
  };

  //삭제 버튼 클릭 시
  const handleDelete = (userId) => {
    if (window.confirm("정말 이 회원을 삭제하시겠습니까?")) {
      deleteMemberMutate(userId);
    }
  };

  return (
    <div className="admin-member-container">
      <h2>👤 회원 관리</h2>
      <table className="admin-member-table">
        <thead>
          <tr>
            <th>회원 ID</th>
            <th>아이디(Username)</th>
            <th>이름</th>
            <th>전화번호</th>
            <th>권한</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {members?.length ? (
            members.map((m) => (
              <tr key={m.userId}>
                <td>{m.userId}</td>
                <td>{m.username}</td>
                <td>{m.name}</td>
                <td>{m.phone || "-"}</td>

                <td>
                  {editUserId === m.userId ? (
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  ) : (
                    m.role
                  )}
                </td>

                <td>
                  {editUserId === m.userId ? (
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="SUSPENDED">SUSPENDED</option>
                      <option value="WITHDRAWN">WITHDRAWN</option>
                    </select>
                  ) : (
                    m.status
                  )}
                </td>

                <td className="action-bs">
                  {editUserId === m.userId ? (
                    <>
                      <button
                        className="save-btn"
                        onClick={() => handleSave(m.userId)}
                      >
                        저장
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setEditUserId(null)}
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(m)}
                      >
                        수정
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(m.userId)}
                      >
                        삭제
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="empty">
                등록된 회원이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUserPage;

