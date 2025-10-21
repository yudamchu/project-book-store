import React, { useState, useEffect, useRef } from "react";
import '../assets/css/AutoBanner.css';

const images = [
  "/banner1.png",
  "/banner2.png",
];

export default function AutoBanner() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const slideInterval = useRef(null);

  // 자동 슬라이드 실행 함수
  const startSlide = () => {
    slideInterval.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // 3초마다 이동
  };

  // 정지 함수
  const stopSlide = () => {
    clearInterval(slideInterval.current);
  };

  // 자동/정지 토글
  const togglePlay = () => {
    if (isPlaying) {
      stopSlide();
    } else {
      startSlide();
    }
    setIsPlaying(!isPlaying);
  };

  // 이전/다음 버튼
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };
  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  // 컴포넌트 마운트 시 자동 슬라이드 시작
  useEffect(() => {
    startSlide();
    return () => stopSlide(); // 언마운트 시 정리
  }, []);

  return (
    <div className="banner-container">
      <div
        className="banner-slider"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {images.map((img, idx) => (
          <img key={idx} src={img} alt={`banner-${idx}`} className="banner-img" />
        ))}
      </div>

      {/* 버튼 컨트롤 */}
      <div className="controls">
        <button onClick={prevSlide}>◀</button>
        <button onClick={togglePlay}>{isPlaying ? "⏸" : "▶"}</button>
        <button onClick={nextSlide}>▶</button>
      </div>
    </div>
  );
}
