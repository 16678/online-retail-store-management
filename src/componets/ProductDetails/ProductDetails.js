import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { productId, category } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) {
        setError("Invalid product ID.");
        setLoading(false);
        return;
      }

      // Determine API URL based on category
      const apiUrl = category
        ? `http://localhost:8086/api/v1/products/category/${category}/${productId}`
        : `http://localhost:8086/api/v1/products/${productId}`;

      try {
        console.log(`Fetching product from: ${apiUrl}`);

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch product details. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, category]);

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="product-details-container">
      <img src={product.imageUrl} alt={product.productName} className="product-image" />
      <div className="product-info">
        <h1>{product.productName}</h1>
        <p><strong>Product ID:</strong> {product.id}</p>
        <p><strong>Brand:</strong> {product.brand}</p>
        <p><strong>Price:</strong> ₹{Math.round(product.price)}</p>
        <p><strong>Discounted Price:</strong> ₹{Math.round(product.discountedPrice)}</p>
        <p><strong>Discount:</strong> {product.discountPercentage}%</p>
        <p><strong>Stock:</strong> {product.stock} left</p>
        <p><strong>Category:</strong> {product.topCategory} {product.secondCategory} {product.thirdCategory}</p>
        <p><strong>Size:</strong> {product.sizeName}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
