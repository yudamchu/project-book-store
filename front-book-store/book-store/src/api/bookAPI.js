import api from "./axios";

export const bookAPI = {
    //도서 조회
    //page, size 담을 수 있는 params
    getList: async(params = {}) => {
        const res = await api.get('/books', {params});
        return res.data;
    },

    getDetail: async(bookId) => {
        const res = await api.get(`/books/${bookId}`);
        return res.data;
    },

    //도서 등록 (관리자 전용)
    create: async (bookData) => {

        //multipart/form-data 요청 만들기
        const formData = new FormData();
        formData.append("book", new Blob([JSON.stringify(bookData)], { type: "application/json" }));

    
        const res = await api.post("/books", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
      
        return res.data;
    },

    //도서 수정 (관리자 전용)
    update: async (bookId, bookData) => {
        const formData = new FormData();
        formData.append("book", new Blob([JSON.stringify(bookData)], { type: "application/json" }));

        

        const res = await api.put(`/books/${bookId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    
        return res.data;
    },

    //도서 삭제
    delete: async (bookId) => {
        const res = await api.delete(`/books/${bookId}`);
        return res.data;
    },

}