import React, { useState } from 'react';
import { useAddress } from '../../hooks/useAddress';
import { useNavigate } from 'react-router-dom';
import styles from '../../assets/css/AddressPageStyle.module.css'; 

function AddressPage() {
  const navigate = useNavigate();

  //주소 리스트 
  const { getAddressList, createAddress, deleteAddress } = useAddress();
  const addressList = getAddressList();

  // 새 주소 추가
  const [newAddr, setNewAddr] = useState({
    receiverName: '',
    receiverPhone: '',
    address: '',
    addressDetail: '',
    isDefault: false,
  });

  const { mutate: createAddrMutate } = createAddress();

  const handleOnchange = (e) => {
    const { name, type, value, checked } = e.target;
    setNewAddr((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 카카오 주소 검색
  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        let addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        setNewAddr((prev) => ({ ...prev, address: addr }));
      },
    }).open();
  };

  const saveAddrBtn = () => {
    if (!newAddr.receiverName || !newAddr.receiverPhone || !newAddr.address) {
      alert('필수 입력 항목을 모두 입력해주세요.');
      return;
    }

    createAddrMutate(newAddr);

    setNewAddr({
      receiverName: '',
      receiverPhone: '',
      address: '',
      addressDetail: '',
      isDefault: false,
    });
  };

  //주소 수정 / 삭제 
  const { mutate: deleteAddressMutate } = deleteAddress();

  const deleteAddrBtn = (id) => {
    if (confirm('해당 주소를 삭제하시겠습니까?')) {
      deleteAddressMutate(id);
    }
  };

  const updateAddrBtn = (id) => {
    navigate('/mypage/update', { state: { id } });
  };

  return (
    <div className={styles.addressContainer}>
      <section className={styles.addressList}>
        <h2>등록된 배송지</h2>
        {addressList.data?.length > 0 ? (
          addressList.data.map((address) => (
            <div className={styles.addressCard} key={address.addressId}>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => deleteAddrBtn(address.addressId)}
              >
                ✕
              </button>

              <p className={styles.receiver}>{address.receiverName}</p>
              <p>{address.receiverPhone}</p>
              <p>{address.address}</p>
              <p>{address.addressDetail}</p>
              {address.isDefault && <p className={styles.defaultTag}>기본배송지</p>}

              <button
                type="button"
                className={styles.updateBtn}
                onClick={() => updateAddrBtn(address.addressId)}
              >
                수정
              </button>
            </div>
          ))
        ) : (
          <p className={styles.emptyText}>등록된 주소가 없습니다.</p>
        )}
      </section>
      <section className={styles.createSection}>
        <h2>배송지 등록</h2>

        <div className={styles.createForm}>
          <label>
            수령인
            <input
              type="text"
              name="receiverName"
              value={newAddr.receiverName}
              onChange={handleOnchange}
            />
          </label>

          <label>
            휴대폰
            <input
              type="text"
              name="receiverPhone"
              value={newAddr.receiverPhone}
              onChange={handleOnchange}
            />
          </label>

          <label>
            주소
            <div className={styles.addressRow}>
              <input
                type="text"
                name="address"
                value={newAddr.address}
                onChange={handleOnchange}
              />
              <button type="button" onClick={handlePostcode}>
                주소찾기
              </button>
            </div>
          </label>

          <label>
            상세주소
            <input
              type="text"
              name="addressDetail"
              value={newAddr.addressDetail}
              onChange={handleOnchange}
            />
          </label>

          <label className={styles.checkboxRow}>
            기본배송지
            <input
              type="checkbox"
              name="isDefault"
              checked={newAddr.isDefault}
              onChange={handleOnchange}
            />
          </label>

          <button type="button" onClick={saveAddrBtn} className={styles.addBtn}>
            주소 추가
          </button>
        </div>
      </section>
    </div>
  );
}

export default AddressPage;
