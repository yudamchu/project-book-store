/* ===========================================================
   📚 ONLINE_BOOKSTORE DATABASE SCHEMA
   -----------------------------------------------------------
   작성자: Yudam Chu
   목적: 온라인 서점 + 중고 거래 + 포인트 시스템
   =========================================================== */

-- -----------------------------------------------------------
-- DATABASE 생성 및 초기 설정
-- -----------------------------------------------------------
SHOW DATABASES;

CREATE DATABASE IF NOT EXISTS online_bookstore
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE online_bookstore;

SHOW TABLES;

-- 초기 점검용
SELECT * FROM users;
SELECT * FROM addresses;
SHOW CREATE TABLE addresses;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;


/* ===========================================================
   1. USERS (사용자 계정)
   =========================================================== */
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '사용자 고유 식별자(PK)',
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '사용자 아이디',
    password VARCHAR(255) NOT NULL COMMENT '사용자 비밀번호',
    name VARCHAR(100) NOT NULL COMMENT '사용자 이름',
    phone VARCHAR(20) COMMENT '휴대폰 번호',
    role ENUM('ADMIN', 'USER') DEFAULT 'USER' COMMENT '권한 (관리자 / 사용자)',
    status ENUM('ACTIVE', 'WITHDRAWN', 'SUSPENDED') DEFAULT 'ACTIVE' COMMENT '계정 상태',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '계정 생성일'
) COMMENT='사용자 계정 테이블';

-- 관리자 계정 추가 (비밀번호: 1234 / BCrypt 암호화)
INSERT INTO users (username, password, name, phone, role, status, created_at)
VALUES (
  'admin',
  '$2a$10$u1zksVrFq4WUVbHzrHBOvO6h7bTqgmH3lz6kB6E8uwbWUkXoST8We',
  '관리자',
  '01012345678',
  'ADMIN',
  'ACTIVE',
  NOW()
);

SELECT * FROM users;


/* ===========================================================
   2. CATEGORIES (도서 카테고리)
   =========================================================== */
CREATE TABLE categories (
    category_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '카테고리 고유 식별자(PK)',
    parent_id BIGINT NULL COMMENT '상위 카테고리 ID (NULL이면 최상위)',
    name VARCHAR(100) NOT NULL COMMENT '카테고리 이름',
    FOREIGN KEY (parent_id) REFERENCES categories(category_id) ON DELETE SET NULL
) COMMENT='도서 카테고리 테이블';

-- 카테고리 데이터 삽입
INSERT INTO categories (name, parent_id)
VALUES 
('국내도서', NULL),
('외국도서', NULL);

INSERT INTO categories (name, parent_id)
SELECT '소설', category_id FROM categories WHERE name='국내도서'
UNION ALL
SELECT '인문/사회', category_id FROM categories WHERE name='국내도서'
UNION ALL
SELECT '과학/기술', category_id FROM categories WHERE name='국내도서'
UNION ALL
SELECT '소설', category_id FROM categories WHERE name='외국도서'
UNION ALL
SELECT '인문/사회', category_id FROM categories WHERE name='외국도서'
UNION ALL
SELECT '과학/기술', category_id FROM categories WHERE name='외국도서';


/* ===========================================================
   3. BOOKS (도서 상세 정보)
   =========================================================== */
CREATE TABLE books (
    book_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '도서 고유 식별자(PK)',
    title VARCHAR(255) NOT NULL COMMENT '도서 제목',
    author VARCHAR(100) COMMENT '저자명',
    publisher VARCHAR(100) COMMENT '출판사명',
    published_date DATE COMMENT '출판일',
    price INT UNSIGNED NOT NULL COMMENT '가격',
    stock INT UNSIGNED DEFAULT 0 COMMENT '재고 수량',
    category_id BIGINT COMMENT '카테고리 ID(FK)',
    description LONGTEXT COMMENT '도서 설명',
    is_new BOOLEAN DEFAULT FALSE COMMENT '신규 도서 여부',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '등록일',
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
) COMMENT='도서 정보 테이블';

-- 샘플 데이터 삽입 (국내도서 / 외국도서)
-- (원본 내용 유지)


/* ===========================================================
   4. BOOK_IMAGES (도서 이미지)
   =========================================================== */
CREATE TABLE book_images (
    image_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '도서 이미지 고유 식별자(PK)',
    book_id BIGINT NOT NULL COMMENT '도서 ID(FK)',
    image_url VARCHAR(255) NOT NULL COMMENT '이미지 URL',
    sort_order TINYINT DEFAULT 0 COMMENT '이미지 표시 순서',
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '업로드 일시',
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
) COMMENT='도서 이미지 테이블';


/* ===========================================================
   5. REVIEWS (도서 리뷰)
   =========================================================== */
CREATE TABLE reviews (
    review_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '리뷰 고유 식별자(PK)',
    book_id BIGINT NOT NULL COMMENT '도서 ID(FK)',
    user_id BIGINT NOT NULL COMMENT '작성자 ID(FK)',
    rating TINYINT UNSIGNED NOT NULL COMMENT '별점 (1~5)',
    comment LONGTEXT COMMENT '리뷰 내용',
    likes INT UNSIGNED DEFAULT 0 COMMENT '좋아요 수',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '작성일',
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) COMMENT='도서 리뷰 테이블';


/* ===========================================================
   6. USED_BOOKS (중고 도서)
   =========================================================== */
CREATE TABLE used_books (
    used_book_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '중고 도서 고유 식별자(PK)',
    book_id BIGINT COMMENT '원본 도서 ID(FK)',
    seller_id BIGINT NOT NULL COMMENT '판매자 ID(FK)',
    title VARCHAR(255) NOT NULL COMMENT '판매글 제목',
    description TEXT COMMENT '판매글 내용',
    price INT UNSIGNED NOT NULL COMMENT '판매 가격',
    `condition` ENUM('상', '중', '하') DEFAULT '중' COMMENT '도서 상태',
    status ENUM('판매중', '거래완료') DEFAULT '판매중' COMMENT '거래 상태',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '등록일',
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE SET NULL,
    FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE CASCADE
) COMMENT='중고 도서 정보 테이블';


/* ===========================================================
   7. USED_BOOK_IMAGES (중고 도서 이미지)
   =========================================================== */
CREATE TABLE used_book_images (
    image_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '중고 도서 이미지 고유 식별자(PK)',
    used_book_id BIGINT NOT NULL COMMENT '중고 도서 ID(FK)',
    image_url VARCHAR(255) NOT NULL COMMENT '이미지 URL',
    sort_order TINYINT DEFAULT 0 COMMENT '정렬 순서',
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '업로드 일시',
    FOREIGN KEY (used_book_id) REFERENCES used_books(used_book_id) ON DELETE CASCADE
) COMMENT='중고 도서 이미지 테이블';


/* ===========================================================
   8. CART (장바구니)
   =========================================================== */
CREATE TABLE cart (
    cart_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '장바구니 고유 식별자(PK)',
    user_id BIGINT NOT NULL COMMENT '사용자 ID(FK)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) COMMENT='장바구니 테이블';


/* ===========================================================
   9. CART_ITEMS (장바구니 항목)
   =========================================================== */
CREATE TABLE cart_items (
    cart_item_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '장바구니 항목 고유 식별자(PK)',
    cart_id BIGINT NOT NULL COMMENT '장바구니 ID(FK)',
    book_id BIGINT NOT NULL COMMENT '도서 ID(FK)',
    quantity INT UNSIGNED DEFAULT 1 COMMENT '수량',
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
) COMMENT='장바구니 항목 테이블';


/* ===========================================================
   10. PAYMENTS (결제)
   =========================================================== */
CREATE TABLE payments (
    payment_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '결제 고유 식별자(PK)',
    user_id BIGINT NOT NULL COMMENT '결제 사용자 ID(FK)',
    amount INT UNSIGNED NOT NULL COMMENT '결제 금액 (포인트)',
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '결제 일시',
    status ENUM('성공', '실패', '취소') DEFAULT '성공' COMMENT '결제 상태',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) COMMENT='결제 정보 테이블 (포인트 결제 전용)';


/* ===========================================================
   11. ORDERS (주문)
   =========================================================== */
CREATE TABLE orders (
    order_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '주문 고유 식별자(PK)',
    user_id BIGINT NOT NULL COMMENT '주문자 ID(FK)',
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '주문 일시',
    status ENUM('결제완료', '배송중', '완료', '취소') DEFAULT '결제완료' COMMENT '주문 상태',
    total_price INT UNSIGNED NOT NULL COMMENT '총 결제 금액',
    payment_id BIGINT NULL COMMENT '결제 ID(FK)',
    address_id BIGINT NULL COMMENT '배송 주소 ID(FK)',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id) ON DELETE SET NULL,
    FOREIGN KEY (address_id) REFERENCES addresses(address_id) ON DELETE SET NULL
) COMMENT='주문 정보 테이블';


/* ===========================================================
   12. ORDER_ITEMS (주문 항목)
   =========================================================== */
CREATE TABLE order_items (
    order_item_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '주문 항목 고유 식별자(PK)',
    order_id BIGINT NOT NULL COMMENT '주문 ID(FK)',
    book_id BIGINT NULL COMMENT '도서 ID(FK)',
    used_book_id BIGINT NULL COMMENT '중고 도서 ID(FK)',
    quantity INT UNSIGNED DEFAULT 1 COMMENT '주문 수량',
    price INT UNSIGNED NOT NULL COMMENT '주문 단가',
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (used_book_id) REFERENCES used_books(used_book_id) ON DELETE SET NULL
) COMMENT='주문 항목 테이블';


/* ===========================================================
   13. ADDRESSES (사용자 배송지)
   =========================================================== */
CREATE TABLE addresses (
    address_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '주소 고유 식별자(PK)',
    user_id BIGINT NOT NULL COMMENT '사용자 ID(FK)',
    receiver_name VARCHAR(100) NOT NULL COMMENT '수령인 이름',
    receiver_phone VARCHAR(20) NOT NULL COMMENT '수령인 연락처',
    address VARCHAR(255) NOT NULL COMMENT '기본 배송 주소',
    address_detail VARCHAR(255) COMMENT '상세 주소',
    is_default BOOLEAN DEFAULT FALSE COMMENT '기본 배송지 여부',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '등록 일시',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) COMMENT='사용자 배송지 테이블';


/* ===========================================================
   14. POINTS (포인트 내역)
   =========================================================== */
CREATE TABLE points (
    point_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '포인트 고유 식별자(PK)',
    user_id BIGINT NOT NULL COMMENT '사용자 ID(FK)',
    change_type ENUM('리뷰', '충전', '결제차감', '환불') NOT NULL COMMENT '포인트 변동 유형',
    points INT NOT NULL COMMENT '포인트 변동 수치 (+ 적립 / - 차감)',
    balance INT NOT NULL COMMENT '변동 후 잔여 포인트',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '포인트 변동 일시',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) COMMENT='포인트 내역 테이블 (충전 / 리뷰 적립 / 결제 차감 / 환불 기록)';


/*================== 테스트용 데이터 삽입 ==========================================================================================================*/

/* ===========================================================
   도서 데이터 생성
   =========================================================== */
INSERT INTO books (title, author, publisher, published_date, price, stock, category_id, description, is_new)
VALUES
/*국내 도서*/
/* 국내도서 > 소설 */
('달러구트 꿈 백화점', '이미예', '팩토리나인', '2020-07-08', 15000, 60,
 (SELECT category_id FROM categories WHERE name='소설' AND parent_id=(SELECT category_id FROM categories WHERE name='국내도서')),
 '“오늘은 어떤 꿈을 사고 싶으신가요?”  
출간 7주년 기념 특별판. 따스한 상상력으로 현대인의 피로를 어루만지는 감성 판타지.  
출간 이후 55만부 이상 판매되며 독자들의 마음을 사로잡은 국민 소설.  
“이 책은 잊고 있던 감정의 온도를 되찾게 한다.” – 조선일보', true),

('불편한 편의점', '김호연', '나무옆의자', '2021-04-20', 14500, 80,
 (SELECT category_id FROM categories WHERE name='소설' AND parent_id=(SELECT category_id FROM categories WHERE name='국내도서')),
 '서울 역 근처 작은 편의점에서 벌어지는 사람들의 이야기.  
2023년 120만부 돌파, 따뜻한 인간애로 독자에게 위로를 전한 작품.  
“모두가 외로운 시대, 작은 친절이 세상을 바꾼다.” – 동아일보', false),

/* 국내도서 > 인문/사회 */
('지적 대화를 위한 넓고 얕은 지식', '채사장', '웨일북', '2020-12-24', 17500, 60,
 (SELECT category_id FROM categories WHERE name='인문/사회' AND parent_id=(SELECT category_id FROM categories WHERE name='국내도서')),
 '철학, 역사, 경제, 정치의 핵심을 한 권에 정리한 국민 교양서.  
출간 300만 부 돌파, 전 세대를 아우르는 지식의 교과서.  
“모든 지식의 입구를 여는 열쇠.” – 독자 리뷰', false),

('어른의 문답법', '이기주', '열림원', '2022-03-10', 16500, 45,
 (SELECT category_id FROM categories WHERE name='인문/사회' AND parent_id=(SELECT category_id FROM categories WHERE name='국내도서')),
 '《언어의 온도》 작가 이기주의 신작.  
말과 관계, 그리고 침묵의 품격에 대한 에세이.  
“어른의 대화에는 말보다 마음이 더 필요하다.” – 본문 중', true),

/* 국내도서 > 과학/기술 */
('보이지 않는 세계', '최재천', '김영사', '2023-06-15', 19000, 35,
 (SELECT category_id FROM categories WHERE name='과학/기술' AND parent_id=(SELECT category_id FROM categories WHERE name='국내도서')),
 '진화생물학자 최재천이 전하는 생명 다양성과 공존의 메시지.  
미시 세계의 경이로움을 따뜻하게 풀어낸 과학 인문서.', true),

('코드 없는 개발, 노코드 혁명', '김지현', '비즈니스북스', '2022-09-20', 18000, 25,
 (SELECT category_id FROM categories WHERE name='과학/기술' AND parent_id=(SELECT category_id FROM categories WHERE name='국내도서')),
 '“이제 프로그래밍은 개발자만의 영역이 아니다.”  
국내 IT전문가 김지현이 말하는 노코드 시대의 혁명적 변화.  
기술과 비즈니스의 경계를 허무는 실용서.', false),


/* 외국도서 */
/* 외국도서 > 소설 */
('1Q84', 'Haruki Murakami', '문학동네', '2009-05-29', 15800, 50,
 (SELECT category_id FROM categories WHERE name='소설' AND parent_id=(SELECT category_id FROM categories WHERE name='외국도서')),
 '도쿄를 무대로 두 주인공의 평행 세계를 그린 무라카미 하루키의 대표작.  
출간 직후 일본과 한국에서 100만부 이상 판매.  
“현실과 환상의 경계에서 사랑을 묻다.”', true),

('The Catcher in the Rye', 'J.D. Salinger', 'Little, Brown and Company', '1951-07-16', 12000, 30,
 (SELECT category_id FROM categories WHERE name='소설' AND parent_id=(SELECT category_id FROM categories WHERE name='외국도서')),
 '현대문학의 고전.  
방황하는 청춘의 내면을 가장 솔직하게 그려낸 소설.  
전 세계 6천만 부 판매, “20세기 최고의 성장소설” – 타임', false),

/* 외국도서 > 인문/사회 */
('사피엔스', '유발 하라리', '김영사', '2015-11-24', 22000, 55,
 (SELECT category_id FROM categories WHERE name='인문/사회' AND parent_id=(SELECT category_id FROM categories WHERE name='외국도서')),
 '인류의 기원과 문명 발전을 다룬 전 세계 1,000만부 베스트셀러.  
AI 시대, 인간의 의미를 다시 묻다.  
“이 책을 읽지 않은 사람과는 대화가 어렵다.” – 가디언', true),

('Thinking, Fast and Slow', 'Daniel Kahneman', 'Farrar, Straus and Giroux', '2011-10-25', 21000, 25,
 (SELECT category_id FROM categories WHERE name='인문/사회' AND parent_id=(SELECT category_id FROM categories WHERE name='외국도서')),
 '노벨경제학상 수상자 다니엘 카너먼의 대표작.  
인간의 사고를 지배하는 두 체계, 빠른 생각과 느린 생각을 통해  
우리가 왜 비합리적 선택을 하는지를 탐구한 명저.', false),

/* 외국도서 > 과학/기술 */
('Brief Answers to the Big Questions', 'Stephen Hawking', 'Bantam Books', '2018-10-16', 18000, 25,
 (SELECT category_id FROM categories WHERE name='과학/기술' AND parent_id=(SELECT category_id FROM categories WHERE name='외국도서')),
 '우주와 인류의 미래에 대한 스티븐 호킹의 마지막 메시지.  
“우리가 별을 향해 나아가야 하는 이유를 말하다.”  
출간 7주년 기념 특별판.', true),

('The Selfish Gene', 'Richard Dawkins', 'Oxford University Press', '2006-03-16', 20000, 20,
 (SELECT category_id FROM categories WHERE name='과학/기술' AND parent_id=(SELECT category_id FROM categories WHERE name='외국도서')),
 '진화생물학의 패러다임을 바꾼 명저.  
“이 책이 없었다면 현대 생물학은 지금과 달랐을 것이다.” – 네이처', false);


/* ===========================================================
    테스트용 사용자 5명 생성
   =========================================================== */
/*
비밀번호는 모두 "1234" (BCrypt 암호화 버전)
$2a$10$u1zksVrFq4WUVbHzrHBOvO6h7bTqgmH3lz6kB6E8uwbWUkXoST8We
*/

INSERT INTO users (username, password, name, phone, role, status, created_at)
VALUES
('user1', '$2a$12$07f3jIKz7FjLonEV8Qpu6e7BATJvn2mcFWQNpESQQUBoJ8.CBVQgC', '김유저', '01011111111', 'USER', 'ACTIVE', NOW()),
('user2', '$2a$12$07f3jIKz7FjLonEV8Qpu6e7BATJvn2mcFWQNpESQQUBoJ8.CBVQgC', '박유저', '01022222222', 'USER', 'ACTIVE', NOW()),
('user3', '$2a$12$07f3jIKz7FjLonEV8Qpu6e7BATJvn2mcFWQNpESQQUBoJ8.CBVQgC', '이유저', '01033333333', 'USER', 'ACTIVE', NOW()),
('user4', '$2a$12$07f3jIKz7FjLonEV8Qpu6e7BATJvn2mcFWQNpESQQUBoJ8.CBVQgC', '최유저', '01044444444', 'USER', 'ACTIVE', NOW()),
('user5', '$2a$12$07f3jIKz7FjLonEV8Qpu6e7BATJvn2mcFWQNpESQQUBoJ8.CBVQgC', '정유저', '01055555555', 'USER', 'ACTIVE', NOW());

-- 점검
SELECT * FROM users;


/* ===========================================================
    장바구니 자동 생성 (각 사용자별 1개)
   =========================================================== */
INSERT INTO cart (user_id)
SELECT u.user_id
FROM users u
LEFT JOIN cart c ON u.user_id = c.user_id
WHERE u.role = 'USER' AND c.user_id IS NULL;

-- 점검
SELECT * FROM cart;


/* ===========================================================
   테스트용 리뷰 삽입 (이달의 독서왕 확인용)
   =========================================================== */

-- user1 → 리뷰 5개
INSERT INTO reviews (book_id, user_id, rating, comment, likes, created_at)
VALUES
(14, (SELECT user_id FROM users WHERE username='user1'), 5, '달러구트는 감성 그 자체네요. 밤새 읽었어요.', 3, NOW()),
(15, (SELECT user_id FROM users WHERE username='user1'), 4, '불편한 편의점 따뜻합니다.', 1, NOW()),
(16, (SELECT user_id FROM users WHERE username='user1'), 5, '지대넓얕 다시 봐도 최고.', 2, NOW()),
(17, (SELECT user_id FROM users WHERE username='user1'), 3, '에세이지만 묵직한 메시지.', 0, NOW()),
(18, (SELECT user_id FROM users WHERE username='user1'), 4, '자연에 대한 시선이 인상적.', 1, NOW());


-- user2 → 리뷰 3개
INSERT INTO reviews (book_id, user_id, rating, comment, likes, created_at)
VALUES
(19, (SELECT user_id FROM users WHERE username='user2'), 4, '기초 개발 입문서로 추천합니다.', 0, NOW()),
(20, (SELECT user_id FROM users WHERE username='user2'), 5, '무라카미 특유의 분위기 최고.', 2, NOW()),
(25, (SELECT user_id FROM users WHERE username='user2'), 5, '생물학의 이해가 깊어졌어요.', 1, NOW());


-- user3 → 리뷰 2개
INSERT INTO reviews (book_id, user_id, rating, comment, likes, created_at)
VALUES
(21, (SELECT user_id FROM users WHERE username='user3'), 4, '고전이지만 여전히 공감돼요.', 0, NOW()),
(22, (SELECT user_id FROM users WHERE username='user3'), 5, '사피엔스는 꼭 읽어야 합니다.', 3, NOW());


-- user4 → 리뷰 4개
INSERT INTO reviews (book_id, user_id, rating, comment, likes, created_at)
VALUES
(14, (SELECT user_id FROM users WHERE username='user4'), 5, '꿈 백화점 너무 따뜻해요.', 2, NOW()),
(15, (SELECT user_id FROM users WHERE username='user4'), 4, '불편한 편의점 감동적입니다.', 1, NOW()),
(23, (SELECT user_id FROM users WHERE username='user4'), 5, '빠른 생각과 느린 생각, 최고의 심리서.', 4, NOW()),
(24, (SELECT user_id FROM users WHERE username='user4'), 4, '호킹의 우주관이 흥미롭네요.', 1, NOW());


-- user5 → 리뷰 1개
INSERT INTO reviews (book_id, user_id, rating, comment, likes, created_at)
VALUES
(25, (SELECT user_id FROM users WHERE username='user5'), 5, '이 책 덕분에 생명 진화에 관심이 생겼어요.', 2, NOW());


USE online_bookstore;

/* ===========================================================
   테스트용 중고 도서 등록 (판매자: user1~user5)
   =========================================================== */

/* user1 등록 */
INSERT INTO used_books (book_id, seller_id, title, price, description, `condition`, status, created_at)
VALUES
(
  14,
  (SELECT user_id FROM users WHERE username='user1'),
  '달러구트 꿈 백화점 중고 판매합니다',
  9000,
  '표지는 약간 사용감 있지만 내부 깨끗합니다.',
  '중',
  '판매중',
  NOW()
),
(
  15,
  (SELECT user_id FROM users WHERE username='user1'),
  '불편한 편의점 중고 판매합니다',
  8000,
  '읽은 후 바로 보관, 거의 새 책 수준입니다.',
  '상',
  '판매중',
  NOW()
);

/* user2 등록 */
INSERT INTO used_books (book_id, seller_id, title, price, description, `condition`, status, created_at)
VALUES
(
  16,
  (SELECT user_id FROM users WHERE username='user2'),
  '지적 대화를 위한 넓고 얕은 지식 중고 팝니다',
  10000,
  '밑줄 약간 있습니다. 전체적으로 상태 양호합니다.',
  '중',
  '판매중',
  NOW()
),
(
  19,
  (SELECT user_id FROM users WHERE username='user2'),
  '자바스크립트 입문서 중고 판매',
  9500,
  '코딩 공부용으로 구매, 상태 매우 양호합니다.',
  '상',
  '판매중',
  NOW()
);




