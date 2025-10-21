import api from "./axios";

export const categoryAPI = {
    //카테고리 조회
    getList: async() => {
        const res = await api.get('/categories');
        return res.data;
    },

    getDetail: async(categoryId) => {
        const res = await api.get(`/categories/${categoryId}`);
        return res.data;
    },

    //카테고리 등록 (관리자 전용)
    create: async (data) => {
        const res = await api.post("/categories", data);
        return res.data;
    },

    //카테고리 수정 (관리자 전용)
    update: async (categoryId, data) => {
        const res = await api.put(`/categories/${categoryId}`, data);
        return res.data;
    },

    //카테고리 삭제
    delete: async (categoryId) => {
        const res = await api.delete(`/categories/${categoryId}`);
        return res.data;
    },

}