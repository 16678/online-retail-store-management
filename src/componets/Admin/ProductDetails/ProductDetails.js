import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductDetails.css"; // Create and style as needed

const API_BASE_URL = "http://localhost:8086/api/products";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/${id}`);
        setProduct(data);
      } catch (err) {
        setError("Failed to fetch product details.");
      }
    };

    fetchProduct();
  }, [id]);

  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="loading">Loading...</div>;

  const {
    productName,
    description,
    price,
    discountedPrice,
    discountPercentage,
    imagePath1,
    imagePath2,
    imagePath3,
    imagePath4,
    imagePath5,
  } = product;

  const images = [imagePath1, imagePath2, imagePath3, imagePath4, imagePath5].filter(Boolean);

  return (
    <div className="product-details-container">
      <h2>{productName}</h2>
      <div className="product-images">
        {images.map((img, index) => (
          <img key={index} src={img} alt={`Product Image ${index + 1}`} className="product-image" />
        ))}
      </div>

      <div className="product-info">
        <p>{description}</p>
        <p>
          Price: <del>₹{Math.round(price)}</del>{" "}
          <strong>₹{Math.round(discountedPrice)}</strong>{" "}
          {discountPercentage > 0 && <span>({discountPercentage}% Off)</span>}
        </p>
      </div>
    </div>
  );
};

export default ProductDetails;
