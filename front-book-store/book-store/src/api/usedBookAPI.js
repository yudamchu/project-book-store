import api from "./axios";

export const usedBookAPI = {
  // 중고 도서 전체 조회
  getList: async (params = {}) => {
    const res = await api.get("/used-books", { params });
    return res.data;
  },

  // 중고 도서 상세 조회
  getDetail: async (usedBookId) => {
    const res = await api.get(`/used-books/${usedBookId}`);
    return res.data;
  },

  // 중고 도서 등록 (이미지 포함)
  create: async (bookData, files) => {
    const formData = new FormData();

    formData.append(
      "data",
      new Blob([JSON.stringify(bookData)], { type: "application/json" })
    );

    if (files && files.length > 0) {
      files.forEach((file) => formData.append("images", file));
    }

    const res = await api.post("/used-books", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },

  // 중고 도서 수정 (이미지 포함)
  update: async (usedBookId, bookData, files) => {
    const formData = new FormData();

    formData.append(
      "data",
      new Blob([JSON.stringify(bookData)], { type: "application/json" })
    );

    if (files && files.length > 0) {
      files.forEach((file) => formData.append("images", file));
    }

    const res = await api.put(`/used-books/${usedBookId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },

  // 중고 도서 삭제
  delete: async (usedBookId) => {
    const res = await api.delete(`/used-books/${usedBookId}`);
    return res.data;
  },
};
