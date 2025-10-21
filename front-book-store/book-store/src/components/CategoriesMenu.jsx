import React, { useState } from 'react';
import { useCategory } from '../hooks/useCategory';
import '../assets/css/CategoriesMenuStyle.css';
import ChildCategories from './ChildCategories';

function CategoriesMenu({isDropDown}) {

    // 카테고리 데이터 가져오기
    const { getCategoryList } = useCategory();
    const { data } = getCategoryList();

    console.log('카테고리 데이터:', data);

    // 마우스 hover 상태 관리
    const [isClick, setIsClick] = useState(false);
    const [hoverId, setHoverId] = useState(null);

    // 상위카테고리 클릭시
    const parentBtn = (id) =>{
        if (hoverId === id) {
            // 같은 카테고리를 다시 클릭하면 toggle
            setIsClick((prev) => !prev);
        } else {
            // 다른 카테고리를 클릭하면 무조건 열림
            setHoverId(id);
            setIsClick(true);
        }
    }
    

    return (
        <div className="categories-container"
            onMouseLeave={isDropDown}
        >
            <div className='parent-box'>
            {
                data?.map((parent) => (
                    
                    <div
                        className="parent"
                        key={parent.categoryId}
                        onClick={() => parentBtn(parent.categoryId)}
                    >
                        <div className="parent-name">{parent.name}</div>
                    </div>
                ))
            }
            </div>
            {
                hoverId && isClick &&(
                    <ChildCategories
                        key={hoverId}
                        parent={data.find((p) => p.categoryId === hoverId)}
                        isClick={()=>setIsClick(false)}
          
                    />
                )
            }
    </div>
  );
}

export default CategoriesMenu;
