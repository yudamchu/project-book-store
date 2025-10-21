import React from 'react';
import styled from 'styled-components';

const Container = styled.div` 
  width:100%;
  padding: 32px;
  line-height: 1.8;
  color: #333;
  font-size: 17px;
  margin: 30px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Section = styled.div`
  margin-bottom: 24px;
  text-align: left;

  h3 {
    font-size: 17px;
    margin-bottom: 10px;
    font-weight: 600;
  }

  ul, ol {
    margin-left: 20px;
    list-style: none;
  }

  li {
    margin-bottom: 6px;
  }

  strong {
    color: #000;
  }
`;

const ContactBox = styled.div`
  background: #f9f2fe;
  border-radius: 10px;
  padding: 16px;
  margin-top: 10px;

  a {
    font-weight: 600;
    text-decoration: none;
  }
`;

function ExchangeInfo() {
  return (
    <Container>
      <Title>반품/교환/문의 안내</Title>

      <Section>
        <h3>1. 반품 및 교환 안내</h3>
        <ul>
          <li>상품 수령 후 <strong>7일 이내</strong> 반품 또는 교환이 가능합니다.</li>
          <li>다음의 경우에는 반품/교환이 불가능합니다:</li>
          <ul>
            <li>고객 부주의로 상품이 훼손된 경우</li>
            <li>상품 포장이 훼손되어 재판매가 어려운 경우</li>
            <li>도서의 경우 낙서, 훼손, 오염이 있는 경우</li>
          </ul>
        </ul>
      </Section>

      <Section>
        <h3>2. 반품/교환 절차</h3>
        <ol>
          <li>하단의 이메일 주소로 반품/교환 문의 부탁드립니다.</li>
          <li>담당자 확인 후 1~2일 내 안내드립니다.</li>
          <li>단순 변심 시 택배비는 고객 부담(편도 2,500원), 상품 불량/오배송 시 당사 부담입니다.</li>
        </ol>
      </Section>

      <Section>
        <h3>3. 환불 안내</h3>
        <ul>
          <li>반품 상품 도착 후 검수 절차를 거쳐 <strong>영업일 기준 3일 이내</strong> 환불됩니다.</li>
          <li>포인트 및 쿠폰 사용 시 동일 조건으로 복원 또는 재적립됩니다.</li>
        </ul>
      </Section>

      <Section>
        <h3>4. 문의 안내</h3>
        <ContactBox>
          <ul>
            <li>상품 관련 문의는 하단의 [문의하기] 버튼을 이용해주세요.</li>
            <li>운영시간: 평일 10:00 ~ 17:00 (점심 12:00 ~ 13:00 / 주말·공휴일 휴무)</li>
            <li>이메일: <a href="mailto:support@linkbook.com">support@linkbook.com</a></li>
            <li>고객센터: 1588-1234</li>
          </ul>
        </ContactBox>
      </Section>
    </Container>
  );
}

export default ExchangeInfo;
