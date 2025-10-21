import { useNavigate } from 'react-router';

function ChildCategories({parent, isClick}) {

    const navigate = useNavigate();
    const childBtn = (id) => {
        navigate('/books', { state: { id } });
    };

    return (
        
            <div className="child-container"
                onMouseLeave={isClick}
            >
                {parent.children.map((child) => (
                    <div
                        className="child"
                        key={child.categoryId}
                        onClick={() => childBtn(child.categoryId)}
                    >{child.name}</div>
                ))}
            </div>
    );
}

export default ChildCategories;