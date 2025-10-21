import "../assets/css/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h2>LinkBook</h2>
          <p>당신의 하루를 채우는 한 권의 책</p>
        </div>
        <ul className="footer-menu">
          <li><a href="/about">회사소개</a></li>
          <li><a href="/policy">이용약관</a></li>
          <li><a href="/privacy">개인정보처리방침</a></li>
          <li><a href="/contact">문의하기</a></li>
        </ul>
      </div>
      <div className="footer-bottom">
        <p>© 2025 LinkBook. All rights reserved.</p>
      </div>
    </footer>
  );
}
