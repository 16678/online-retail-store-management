import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductImages = ({ productId }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch images by product ID
    axios.get(`http://localhost:8086/api/products/images/by-product/${productId}`)
      .then(response => {
        setImageUrls(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching images:', error);
        setError('Failed to load images.');
        setLoading(false);
      });
  }, [productId]);

  return (
    <div className="image-gallery" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
      {loading && <p>Loading images...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && imageUrls.length === 0 && <p>No images found for this product.</p>}

      {/* Display images */}
      {imageUrls.length > 0 && imageUrls.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Product ${index + 1}`}
          style={{
            width: '150px',
            height: '150px',
            objectFit: 'cover',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
          }}
        />
      ))}
      
      {/* If you want to display a single image */}
      {/* <img src="http://localhost:8086/api/products/images/1747207461398_car.jpg" alt="Product Image" /> */}
    <img src="http://localhost:8086/api/products/images/1747207461398_car.jpg" alt="Product Image" />

    </div>
  );
};

export default ProductImages;
