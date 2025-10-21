import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../../assets/css/AdminLayoutStyle.css";

function AdminLayout() {
  const location = useLocation();

  const navList = [
    { name: "회원 관리", path: "/admin/users" },
    { name: "주문 / 배송 관리", path: "/admin/orders" },
    { name: "도서 관리", path: "/admin/books" },
    { name: "포인트 관리", path: "/admin/point" },
    { name: "LinkBook으로", path:"/"}
  ];

  return (
    <div className="table-wrapper">
    <div className="admin-layout">
      <header className="admin-header">
        <h1>📚 관리자 페이지</h1>
        <nav className="admin-nav">
          {navList.map((nav) => (
            <Link
              key={nav.path}
              to={nav.path}
              className={`admin-link ${
                location.pathname === nav.path ? "active" : ""
              }`}
            >
              {nav.name}
            </Link>
          ))}
        </nav>
      </header>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
    </div>
  );
}

export default AdminLayout;
