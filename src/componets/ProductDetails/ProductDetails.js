import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "./ProductDetails.css";

const API_BASE_URL = "http://localhost:8086/api/products";

const ProductDetail = () => {
  const { productId } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/${productId}`);
        setProduct(response.data);
        setActiveImage(response.data.imagePath1); // default to first image
      } catch (err) {
        setError("Failed to fetch product.");
      } finally {
        setLoading(false);
      }
    };

    if (!product) {
      fetchProduct();
    } else {
      setActiveImage(product.imagePath1);
      setLoading(false);
    }
  }, [product, productId]);

  if (loading) return <div>Loading product details...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>No product found.</div>;

  const images = [
    product.imagePath1,
    product.imagePath2,
    product.imagePath3,
    product.imagePath4,
    product.imagePath5,
  ].filter(Boolean);

  return (
    <div className="product-detail-wrapper">
      {/* Left section: Images */}
      <div className="left-section">
        <div className="image-section">
          <div className="main-image">
            <img src={activeImage} alt="Main product" />
          </div>
          <div className="thumbnail-row">
            {images.map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${activeImage === imgSrc ? "active" : ""}`}
                onClick={() => setActiveImage(imgSrc)}
              />
            ))}
          </div>
        </div>

        <div className="product-details-left">
          <h3>Product Details</h3>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Stock Available:</strong> {product.stock}</p>
          <p><strong>Top Category:</strong> {product.topCategory}</p>
          <p><strong>Second Category:</strong> {product.secondCategory}</p>
          <p><strong>Third Category:</strong> {product.thirdCategory}</p>
          <p><strong>Size:</strong> {product.sizeName}</p>
          <p><strong>Description:</strong></p>
          <p>{product.productName}</p>
        </div>
      </div>

      {/* Right section: Title, pricing, etc. */}
      <div className="right-section">
        <nav className="breadcrumb">
          Home / {product.topCategory || "Category"} / {product.productName}
        </nav>

        <h1 className="product-name">{product.productName}</h1>
        <p className="product-time">Delivery in 15-20 mins</p>

        <button className="view-by-button">View all by {product.brand || "Brand"}</button>

        <p className="unit">{product.sizeName}</p>

        <div className="price-section">
          <span className="price">₹{Math.round(product.discountedPrice)}</span>
          <span className="mrp">MRP ₹{Math.round(product.price)}</span>
          <span className="discount">{product.discountPercentage}% OFF</span>
        </div>
        <p className="inclusive-text">(Inclusive of all taxes)</p>

        <button className="add-to-cart-btn">ADD</button>

        <section className="why-shop-section">
          <h3>Why shop from us?</h3>
          <div className="reason">
            <strong>Express Delivery</strong>
            <p>Fast doorstep delivery from nearby stores.</p>
          </div>
          <div className="reason">
            <strong>Best Prices</strong>
            <p>Attractive offers straight from manufacturers.</p>
          </div>
          <div className="reason">
            <strong>Genuine Products</strong>
            <p>5000+ verified products in all categories.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
