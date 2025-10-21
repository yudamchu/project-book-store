import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { bookImageAPI } from "../api/bookImageAPI"


export const useBookImage = () => {

    const qc = useQueryClient();
/* ------------------------------ QUERY ------------------------------ */

    //전체 도서 이미지 조회
    const getAllImage = () => {
        return useQuery({
            queryKey:['bookImages'],
            queryFn: ()=> bookImageAPI.getAll(),
        })
    }
    //특정 도서 이미지 조회
     const getBookImage = (bookId) => {
        return useQuery({
            queryKey:['bookImages', bookId],
            queryFn: ()=> bookImageAPI.get(bookId),
            enabled: !!bookId, // bookId 있을 때만 요청
        });
    };

 /* ---------------------------- MUTATIONS ---------------------------- */
    //도서 이미지 등록 (관리자)
    const createBookImage = () => {
        return useMutation({
            mutationFn: ({bookId, files})=> bookImageAPI.create(bookId, files),
            onSuccess: () => {
                
                qc.invalidateQueries(["bookImages"]); // 목록 캐시 무효화 → 자동 새로고침
                alert("도서 이미지가 성공적으로 등록되었습니다.");        
            },

            onError: (err) => {
                console.log(err);
                alert("도서 이미지 등록 실패");
            }
        });
    };

    //도서 이미지 순서 수정 (관리자)
    const updateSortImage = () => {
        return useMutation({
            mutationFn: ({imageId, sortOrder}) => bookImageAPI.updateSort(imageId, sortOrder),
            onSuccess: () => {
                qc.invalidateQueries(["bookImages"]); // 목록 캐시 무효화 → 자동 새로고침
                alert("도서 이미지 순서가 수정되었습니다.");
            },
            onError: (err) => {
                console.log(err);
                alert("도서 이미지 순서 수정 실패.")
            }
        });
    };

    //도서 이미지 삭제 (관리자)
    const deleteBookImages = () => {
        return useMutation({
            mutationFn: ({imageId}) => bookImageAPI.delete(imageId),
            onSuccess: () => {
                qc.invalidateQueries(["bookImages"]);
                alert("도서 이미지가 삭제되었습니다.");
            },
            onError: (err) => {
                console.log(err);
                alert("도서 이미지 삭세 실패.")
            }

        });
    };


return {
    getAllImage,
    getBookImage,
    createBookImage,
    updateSortImage,
    deleteBookImages
}


}