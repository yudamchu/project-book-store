import api from "./axios";

export const bookImageAPI = {
    
    //전제 이미지 조회
    getAll: async() => {
        const res = await api.get("/book-images");
        return res.data;
    },
    //특정 도서 이미지 조회
    get: async(bookId) => {
        const res = await api.get(`/book-images/${bookId}`);
        return res.data;
    },

    //도서 이미지 등록 (관리자)
    create: async(bookId, files) => {

        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));

        const res = await api.post(`/book-images/${bookId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }});

        return res.data;
    },

    //도서 이미지 순서 수정 (관리자)
    updateSort: async(imageId, sortOrder) => {

        const res = await api.put(`/book-images/${imageId}`, null, {
            params: { sortOrder },
        });

        return res.data;
    },

    //도서 이미지 삭제 (관리자)
    delete: async(imageId) => {
    const res = await api.delete(`/book-images/${imageId}`);
    return res.data;
    }
}
