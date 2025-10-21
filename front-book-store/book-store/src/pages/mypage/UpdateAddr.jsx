import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/UpdateAddrStyle.css";
import { useAddress } from "../../hooks/useAddress";

function UpdateAddr() {
  const navigate = useNavigate();

  // 주소 id 가져오기
  const location = useLocation();
  const id = location.state?.id;

  // 주소 정보 가져오기
  const { getAddressList, updateAddress } = useAddress();
  const { data: addressList } = getAddressList();

  const addr = addressList?.find((x) => x.addressId === id);

  const [newAddr, setNewAddr] = useState({
    receiverName: addr?.receiverName || "",
    receiverPhone: addr?.receiverPhone || "",
    address: addr?.address || "",
    addressDetail: addr?.addressDetail || "",
    isDefault: addr?.isDefault || false,
  });

  // 주소찾기 버튼
  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        let addr = "";
        if (data.userSelectedType === "R") {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }

        setNewAddr((prev) => ({
          ...prev,
          address: addr,
        }));
      },
    }).open();
  };

  // input 변경 시
  const handleOnchange = (e) => {
    const { name, type, value, checked } = e.target;
    setNewAddr((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 수정 버튼
  const { mutate: updateAddrMutate } = updateAddress();
  const handleUpdate = () => {
    if (!newAddr.receiverName || !newAddr.receiverPhone || !newAddr.address) {
      alert("필수 입력 항목을 모두 입력해주세요.");
      return;
    }
    updateAddrMutate({ id, data: newAddr });
    navigate(-1);
  };

  return (
    <div className="addr-update-container">
      <h2 className="addr-title">배송지 수정</h2>

      <div className="addr-form">
        <label className="addr-label">
          수령인
          <input
            type="text"
            name="receiverName"
            value={newAddr.receiverName}
            onChange={handleOnchange}
            className="addr-input"
            required
          />
        </label>

        <label className="addr-label">
          휴대폰 번호
          <input
            type="text"
            name="receiverPhone"
            value={newAddr.receiverPhone}
            onChange={handleOnchange}
            className="addr-input"
          />
        </label>

        <label className="addr-label">
          주소
          <div className="addr-row">
            <input
              type="text"
              name="address"
              value={newAddr.address}
              onChange={handleOnchange}
              className="addr-input"
            />
            <button type="button" onClick={handlePostcode} className="addr-btn">
              주소찾기
            </button>
          </div>
        </label>

        <label className="addr-label">
          상세 주소
          <input
            type="text"
            name="addressDetail"
            value={newAddr.addressDetail}
            onChange={handleOnchange}
            className="addr-input"
          />
        </label>

        <label className="addr-checkbox">
          <input
            type="checkbox"
            name="isDefault"
            checked={newAddr.isDefault}
            onChange={handleOnchange}
          />
          기본 배송지로 설정
        </label>
      </div>

      <div className="addr-btn-group">
        <button type="button" className="addr-submit-btn" onClick={handleUpdate}>
          수정하기
        </button>
        <button
          type="button"
          className="addr-cancel-btn"
          onClick={() => navigate(-1)}
        >
          취소
        </button>
      </div>
    </div>
  );
}

export default UpdateAddr;
