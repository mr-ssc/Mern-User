import React, { useState, useEffect } from 'react';
import './Slider.css'; // Import the CSS file
import slide1 from './Img/slide-1.png';
import slide2 from './Img/slide-2.png';
import slide3 from './Img/slide-3.png';
import slide4 from './Img/slide-4.png';

const Slider = () => {
  // Search functionality
  const [isActive, setIsActive] = useState(false);

  const toggleSearch = () => {
    setIsActive(!isActive);
  };

  // Slider functionality
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    { id: 1, src: slide1, alt: 'Slide 1' },
    { id: 2, src: slide2, alt: 'Slide 2' },
    { id: 3, src: slide3, alt: 'Slide 3' },
    { id: 4, src: slide4, alt: 'Slide 4' },
  ];

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="search-and-slider-container">
      {/* Search Bar */}
      <div className="special-offers">
        <div className="search-container">
          <h2>Special Offers</h2>
          <input
            type="text"
            className={`search-input ${isActive ? 'active' : ''}`}
            placeholder="Search..."
          />
          <div className="search-icon" onClick={toggleSearch}>
            <i className="fas fa-search"></i>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="slider-container">
        <div className="slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {slides.map((slide) => (
            <div key={slide.id} className="slide">
              <img src={slide.src} alt={slide.alt} />
            </div>
          ))}
        </div>
        <div className="navigation-dots">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;