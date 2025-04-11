import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductList.css";

const ProductList = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = category
          ? `http://localhost:8086/api/v1/products/category/${category}`
          : "http://localhost:8086/api/v1/products";
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(
          data.map((product) => ({
            ...product,
            quantity: 1, // Default quantity
          }))
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleQuantityChange = (productId, action) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              quantity:
                action === "increase"
                  ? product.quantity + 1
                  : product.quantity > 1
                  ? product.quantity - 1
                  : 1,
            }
          : product
      )
    );
  };

  const handleAddProductToCart = async (product) => {
    try {
      const response = await fetch("http://localhost:8086/api/v1/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: product.quantity,
        }),
      });

      if (!response.ok) throw new Error("Failed to add product to cart");
      alert("🛒 Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("❌ Failed to add to cart. Try again.");
    }
  };

  return (
    <div className="product-container">
      <h1>{category ? `Products in ${category}` : "All Products"}</h1>
      {loading ? (
        <p>Loading products...</p>
      ) : products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.imageUrl}
                alt={product.productName}
                className="pro-images"
                onClick={() => navigate(`/product/${product.id}`)}
                style={{ cursor: "pointer" }}
              />
              <div className="product-details">
                <h2>{product.productName}</h2>
                <p>₹ {Math.round(product.discountedPrice)}</p>
                <del>
                  <p>₹ {Math.round(product.price)}</p>
                </del>
                <p>{product.discountPercentage}% Off</p>
              </div>
              <div className="quantity-controls">
                <button
                  className="quantity-button"
                  onClick={() => handleQuantityChange(product.id, "decrease")}
                >
                  -
                </button>
                <span className="quantity-display">{product.quantity}</span>
                <button
                  className="quantity-button"
                  onClick={() => handleQuantityChange(product.id, "increase")}
                >
                  +
                </button>
              </div>
              <button
                className="add-to-cart-button"
                onClick={() => handleAddProductToCart(product)}
              >
                🛒 Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default ProductList;
