import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Category_slide.css'; // Import the CSS file

const Category_slide = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    fetch('https://mern-backend-sable.vercel.app/api/category')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  // Settings for the slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Show 4 images by default
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024, // For screens smaller than 1024px
        settings: {
          slidesToShow: 3, // Show 3 images
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768, // For screens smaller than 768px
        settings: {
          slidesToShow: 4, // Show 2 images
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 490, // For screens smaller than 480px
        settings: {
          slidesToShow: 3, // Show 1 image
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="category-slide">
      <Slider {...settings}>
        {categories.map((category) => (
          <div key={category.id} className="category-item">
            <img src={category.image} alt={category.name} className="category-image" />
            <p className="category-name">{category.name}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Category_slide;