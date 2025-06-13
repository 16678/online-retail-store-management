import React, { useState, useEffect } from 'react';
import './Carousal.css';
import axios from 'axios';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:8086/categories/all');
        const imageList = response.data.map(item => ({
          id: item.id,
          src: `http://localhost:8086/images${item.imagePath.startsWith('/') ? '' : '/'}${item.imagePath}`,
          alt: item.categoryName || 'Category Image',
        }));
        setImages(imageList);
      } catch (err) {
        console.error('Error fetching images:', err);
        setError('Failed to load images.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000); // change slide every 3 seconds

      // Cleanup on unmount
      return () => clearInterval(interval);
    }
  }, [images]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + images.length) % images.length
    );
  };

  if (loading) return <div className="carousel">Loading images...</div>;
  if (error) return <div className="carousel error">{error}</div>;
  if (images.length === 0) return <div className="carousel">No images to display</div>;

  return (
    <div className="carousel">
      <div className="carousel-inner">
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="carousel-image"
        />
      </div>

      <button className="carousel-button prev" onClick={prevSlide}>❮</button>
      <button className="carousel-button next" onClick={nextSlide}>❯</button>
    </div>
  );
};

export default Carousel;
