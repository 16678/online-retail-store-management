// Add to imports
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "./ProductDetails.css";

const API_BASE_URL = "http://localhost:8086/api/products";
const CART_API_URL = "http://localhost:8086/api/cart";

const ProductDetail = () => {
  const { productId } = useParams();
  const location = useLocation();
  const customerId = localStorage.getItem("customerId");

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(0); // 👈 For product quantity

  const hasDiscount = product?.discountPercentage > 0;

  // 🔄 Fetch product and quantity
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/${productId}`);
        setProduct(response.data);
        setActiveImage(response.data.imagePath1);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCartQty = async () => {
      try {
        const response = await axios.get(`${CART_API_URL}/${customerId}`);
        const item = response.data.find(
          (entry) => entry.product.productId === parseInt(productId)
        );
        setQuantity(item ? item.quantity : 0);
      } catch (e) {
        console.error("Cart fetch failed", e);
      }
    };

    if (!product) {
      fetchProduct();
    } else {
      setActiveImage(product.imagePath1);
      setLoading(false);
    }

    if (customerId) fetchCartQty();
  }, [productId]);

  const updateCart = async (qtyChange) => {
    const newQty = quantity + qtyChange;
    if (newQty < 0 || !customerId) return;

    try {
      if (newQty === 0) {
        await axios.delete(`${CART_API_URL}/remove`, {
          params: { customerId, productId },
        });
      } else {
        await axios.post(`${CART_API_URL}/add`, null, {
          params: { customerId, productId, quantity: qtyChange },
        });
      }
      setQuantity(newQty);
    } catch (err) {
      console.error("Failed to update cart", err);
    }
  };

  // UI loading states
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
    <div className="product-page-wrapper">
      <div className="product-detail-wrapper">
        <div className="left-section">
          <div className={`image-section ${hasDiscount ? "has-discount-top-padding" : ""}`}>
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
            <p><strong>Stock:</strong> {product.stock}</p>
            <p><strong>Top Category:</strong> {product.topCategory}</p>
            <p><strong>Second Category:</strong> {product.secondCategory}</p>
            <p><strong>Third Category:</strong> {product.thirdCategory}</p>
            <p><strong>Size:</strong> {product.sizeName}</p>
            <p><strong>Description:</strong></p>
            <p>{product.productName}</p>
          </div>
        </div>

        <div className="right-section">
          <h1 className="product-name">{product.productName}</h1>
          <p className="product-time">Delivery in 15–20 mins</p>

          <button className="view-by-button">
            View all by {product.brand || "Brand"}
          </button>

          <p className="unit">{product.sizeName}</p>

          <div className="price-section">
            <span className="price">₹{Math.round(product.discountedPrice)}</span>
            <span className="mrp">MRP ₹{Math.round(product.price)}</span>
            {hasDiscount && (
              <span className="discount">{product.discountPercentage}% OFF</span>
            )}
          </div>

          <p className="inclusive-text">(Inclusive of all taxes)</p>

          {/* ✅ Cart Quantity Controls */}
          {quantity === 0 ? (
            <button className="add-to-cart-btn" onClick={() => updateCart(1)}>
              ADD
            </button>
          ) : (
            <div className="quantity-controls">
              <button onClick={() => updateCart(-1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => updateCart(1)}>+</button>
            </div>
          )}

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
    </div>
  );
};

export default ProductDetail;
