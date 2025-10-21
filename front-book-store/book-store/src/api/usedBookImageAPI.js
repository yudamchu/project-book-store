import api from "./axios";

export const usedBookImageAPI = {
    
    //전제 이미지 조회
    getAll: async() => {
        const res = await api.get("/used-book-images");
        return res.data;
    },
    //특정 도서 이미지 조회
    get: async(usedBookId) => {
        const res = await api.get(`/used-book-images/${usedBookId}`);
        return res.data;
    },

    //도서 이미지 등록 (관리자)
    create: async(usedBookId, files) => {

        const formData = new FormData();
        files.forEach((file, idx) => {
            formData.append("images", file);
            formData.append("sortOrders", idx === mainImageIndex ? 1 : 0);
        });

        await api.post(`/book-images/${usedBookId}`, formData);

        return res.data;
    },

    //도서 이미지 순서 수정 (관리자)
    updateSort: async(imageId, sortOrder) => {

        const res = await api.put(`/used-book-images/${imageId}`, null, {
            params: { sortOrder },
        });

        return res.data;
    },

    //도서 이미지 삭제 (관리자)
    delete: async(imageId) => {
    const res = await api.delete(`/used-book-images/${imageId}`);
    return res.data;
    }
}
