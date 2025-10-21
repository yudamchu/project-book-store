import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookAPI } from "../api/bookAPI";

export const useBook = () => {

    const qc = useQueryClient();

    /* ------------------------------ QUERY ------------------------------ */

    //도서 리스트 조회
    const getBookList = () => {
        return useQuery({
            queryKey:['book'],
            queryFn: ()=> bookAPI.getList(),
        });
    };

    //도서 상세 정보 조회
    const getBookDetail = (bookId) => {
        return useQuery({
            queryKey:['book', bookId],
            queryFn: () => bookAPI.getDetail(bookId),
            enabled: !!bookId, //bookId가 있을때만 요청 보내기

        });
    };


    /* ---------------------------- MUTATIONS ---------------------------- */

    //도서 등록
    const createBook = () =>{
        return useMutation({
            mutationFn: ({bookData})=> bookAPI.create(bookData),
            onSuccess: () => {
                
                qc.invalidateQueries(["books"]); // 목록 캐시 무효화 → 자동 새로고침
                alert("도서가 성공적으로 등록되었습니다.");        
            },

            onError: (err) => {
                console.error(err);
                alert("도서 등록 실패.");
            },
        });
    };
    

    //도서 수정 
    const updateBook = () => {
        return useMutation({
            mutationFn: ({bookId, bookData}) => bookAPI.update(bookId, bookData),
            onSuccess: (_,variables) => {
                qc.invalidateQueries(["book"]); //목록 갱신
                qc.invalidateQueries(["book", variables.bookId]) //상세 갱신
                alert("도서가 성공적으로 수정되었습니다.");
            },

            onError: (err) => {
                console.log(err);
                alert("도서 수정 실패.");
            }
        });
    };


    //도서 삭제
    const deleteBook = () => {
        return useMutation({
            mutationFn: (bookId) => bookAPI.delete(bookId),
            onSuccess: () => {
                qc.invalidateQueries(["book"]);
                alert("도서가 성공적으로 삭제되었습니다.");
            },
            onError: (err) => {
                console.log(err);
                alert("도서 삭제 실패");
            }
        });
    };


    return {
        getBookList,
        getBookDetail,
        createBook,
        updateBook,
        deleteBook
    };
};