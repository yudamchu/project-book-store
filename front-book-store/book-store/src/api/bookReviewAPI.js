import api from "./axios";

export const bookReviewAPI = {
    //특정 도서의 리뷰 조회 (모든 사용자 가능)
    get: async (bookId) => {
        const res = await api.get(`/book-reviews/${bookId}`);
        return res.data;
    },

    // 특정 사용자의 리뷰 전체 조회
    getByUser: async (userId) => {
        const res = await api.get(`/book-reviews/user/${userId}`);
        return res.data;
    },

    //이달의 랭킹
    getMonthlyRanking: async () => {
        const res = await api.get("/book-reviews/ranking/monthly");
        return res.data;
    },

    //리뷰 등록 (USER만 가능) 
    create: async (bookId, rating, comment) => {
        const res = await api.post(`/book-reviews/${bookId}`, null, {
            params: { rating, comment },
        });
        return res.data;
    },

    //리뷰 수정 (본인 or ADMIN) 
    update: async (reviewId, rating, comment, likes) => {
        const res = await api.put(`/book-reviews/${reviewId}`, null, {
            params: { rating, comment, likes },
        });
        return res.data;
    },

    //리뷰 삭제 (본인 or ADMIN) 
    delete: async (reviewId) => {
        const res = await api.delete(`/book-reviews/${reviewId}`);
        return res.data;
    },
};
