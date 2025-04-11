import React, { useState } from 'react';
import './Carousal.css';

// Import images from the assets folder
import image1 from '../../assets/Home.webp';
import image2 from '../../assets/electronics.jpg';
import image3 from '../../assets/Fashion.jpeg';

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [
        { id: 1, src: image1, alt: 'Product 1' },
        { id: 2, src: image2, alt: 'Product 2' },
        { id: 3, src: image3, alt: 'Product 3' },
    ];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex - 1 + images.length) % images.length
        );
    };

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
