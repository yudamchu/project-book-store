import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { usedBookImageAPI } from "../api/usedBookImageAPI";
import { useNavigate } from "react-router";


export const useUsedBookImage = () => {
    const navigate = useNavigate();
    const qc = useQueryClient();

/* ------------------------------ QUERY ------------------------------ */

    //전체 도서 이미지 조회
    const getAllImage = () => {
        return useQuery({
            queryKey:['usedBookImage'],
            queryFn: ()=> usedBookImageAPI.getAll(),
        })
    }
    //특정 도서 이미지 조회
     const getBookImage = (usedBookId) => {
        return useQuery({
            queryKey:['usedBookImage', usedBookId],
            queryFn: ()=> usedBookImageAPI.get(usedBookId),
            enabled: !!usedBookId, // bookId 있을 때만 요청
        });
    };

 /* ---------------------------- MUTATIONS ---------------------------- */
    //도서 이미지 등록 (관리자)
    const createBookImage = () => {
        return useMutation({
            mutationFn: ({usedBookId, files})=> usedBookImageAPI.create(usedBookId, files),
            onSuccess: () => {
                
                qc.invalidateQueries(["usedBookImage"]); // 목록 캐시 무효화 → 자동 새로고침
                alert("도서 이미지가 성공적으로 등록되었습니다.");
                
                       
            },

            onError: (error) => {
                alert(error.response?.data?.message || "이미지 업로드 실패");
            }
        });
    };

    //도서 이미지 순서 수정 
    const updateSortImage = () => {
        return useMutation({
            mutationFn: ({imageId, sortOrder}) => usedBookImageAPI.updateSort(imageId, sortOrder),
            onSuccess: () => {
                qc.invalidateQueries(["usedBookImage"]); // 목록 캐시 무효화 → 자동 새로고침
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
            mutationFn: ({imageId}) => usedBookImageAPI.delete(imageId),
            onSuccess: () => {
                qc.invalidateQueries(["usedBookImage"]);
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