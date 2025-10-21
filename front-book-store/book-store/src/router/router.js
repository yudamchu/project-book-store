import { createBrowserRouter } from "react-router";
import Layout from "../pages/Layout";
import MainPage from "../pages/home/MainPage";
import LoginPage from "../pages/auth/LoginPage";
import JoinPage from "../pages/auth/JoinPage";
import UserInfoPage from "../pages/mypage/UserInfoPage";
import MyPage from "../pages/mypage/MyPage";
import AddressPage from "../pages/mypage/AddressPage";
import UpdateAddr from "../pages/mypage/UpdateAddr";
import BookListPage from "../pages/books/BookListPage";
import NewBookListPage from "../pages/books/NewBookListPage";
import DetailPage from "../pages/books/DetailPage";
import SearchListPage from "../pages/books/SearchListPage";
import ReviewsPage from "../pages/mypage/ReviewsPage";
import UsedBookListPage from "../pages/usedBooks/usedBookListPage";
import UsedBookDetail from "../pages/usedBooks/usedBookDetail";
import MyUsedBookPage from "../pages/mypage/MyUsedBookPage";
import UpdateReview from "../pages/mypage/UpdateReview";
import UpdateUsedBook from "../pages/mypage/UpdateUsedBook";
import UploadUsedBook from "../pages/mypage/UploadUsedBook";
import CartPage from "../pages/cart/CartPage";
import PointPage from "../pages/mypage/PointPage";
import Order from "../pages/order/Order";
import OrderListPage from "../pages/mypage/OrderListPage";
import AdminUserPage from "../pages/admin/AdminUserPage";
import AdminOrderPage from "../pages/admin/AdminOrderPage";
import AdminBookPage from "../pages/admin/AdminBookPage";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminBookImagePage from "../pages/admin/AdminBookImagePage";
import AdminBookUploadPage from "../pages/admin/AdminBookUploadPage";
import CreateReview from "../pages/mypage/CreateReview";
import ShippingPage from "../pages/mypage/ShippingPage";
import TotalBooksPage from "../pages/books/TotalBooksPage";
import RankPage from "../pages/rank/RankPage";
import RankerReviewPage from "../pages/rank/RankerReviewPage";
import AdminPointPage from "../pages/admin/AdminPointPage";

export const router = createBrowserRouter([

    // 메인 레이아웃
    {
        path: '/',
        Component: Layout,
        children: [

            { index: true, Component: MainPage },

            // 마이페이지
            {
                path: 'mypage',
                Component: MyPage,
                children: [
                    { index: true, Component: UserInfoPage },
                    { path: 'address', Component: AddressPage },
                    { path: 'update', Component: UpdateAddr },
                    { path: 'reviews', Component: ReviewsPage },
                    { path: 'updatereview', Component: UpdateReview },
                    { path: 'usedbooks', Component: MyUsedBookPage },
                    { path: 'usedbooks/update', Component: UpdateUsedBook },
                    { path: 'usedbooks/upload', Component: UploadUsedBook },
                    { path: 'point', Component: PointPage },
                    { path: 'order/list', Component: OrderListPage },
                    { path: 'create/review', Component: CreateReview },
                    { path: 'ship', Component: ShippingPage },
                ]
            },

            // 도서 관련
            { path: 'books', Component: BookListPage },
            { path: 'total', Component: TotalBooksPage },
            { path: 'new', Component: NewBookListPage },
            { path: 'detail', Component: DetailPage },
            { path: 'search', Component: SearchListPage },

            // 중고 도서
            { path: 'usedbooks', Component: UsedBookListPage },
            { path: 'useddetails', Component: UsedBookDetail },

            // 장바구니/주문
            { path: 'cart', Component: CartPage },
            { path: 'order', Component: Order },

            // 랭킹
            { path: 'rank', Component: RankPage },
            { path: 'ranker/reviews', Component: RankerReviewPage },
        ]
    },

    // 로그인/회원가입
    { path: 'login', Component: LoginPage },
    { path: 'signup', Component: JoinPage },

    // 관리자
    {
        path: 'admin',
        Component: AdminLayout,
        children: [
            { index: true, Component: AdminUserPage },
            { path: 'users', Component: AdminUserPage },
            { path: 'orders', Component: AdminOrderPage },
            { path: 'point', Component: AdminPointPage },
            { path: 'books', Component: AdminBookPage },
            { path: 'books/upload', Component: AdminBookUploadPage },
            { path: 'book-images/:bookId', Component: AdminBookImagePage },
        ],
    }
]);
