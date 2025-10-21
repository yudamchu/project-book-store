import React from 'react';
import styled from 'styled-components';
import { useBookImage } from '../hooks/useBookImage';


const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    justify-self: center;
    white-space: pre-line; /* \n → 줄바꿈 처리 */
    text-align: left;      /* 왼쪽 정렬 강제 */
    line-height: 1.8;
    font-size: 18px;
    color: #333;
    gap: 20px;
    margin: 30px;
    padding: 30px;
    width: 100%;
    border-bottom: 1px solid #a067cd;
    border-top: 1px solid #a067cd;
    

`
function BookDescription({book}) {
    const {getBookImage} = useBookImage();
    const {data: images} = getBookImage(book.bookId);

   const filteredImages = images?.filter(x => x.sortOrder !== 1);

    return (
        <Container>
            <p style={{fontWeight: 700, fontSize: 22}}>책 소개</p>
            <p>{book.description}</p>
            {filteredImages?.map(x => 
                <div key={x.imageId} className="image-item">
                  <img
                    src={`http://localhost:9090${x.imageUrl}`}
                    alt="book"
                  />
                 </div> 
            ) }
        </Container>
    );
}

export default BookDescription;