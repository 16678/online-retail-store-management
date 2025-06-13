import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductList.css";

const API_BASE_URL = "http://localhost:8086/api/products";
const CART_API_URL = "http://localhost:8086/api/cart";

const ProductList = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const customerId = localStorage.getItem("customerId");

  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(false); // ✅ Added

  const getCartStorageKey = () => `cart_${customerId}`;

  const fetchCartFromBackend = async () => {
    try {
      const response = await axios.get(`${CART_API_URL}/${customerId}`);
      const cart = response.data || [];

      const quantityMap = {};
      cart.forEach(({ product, quantity }) => {
        const id = product.productId || product.id;
        quantityMap[id] = quantity;
      });

      setQuantities(quantityMap);
    } catch (err) {
      console.error("Failed to sync cart with backend:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/category/${category}`);
      const productArray = Array.isArray(response.data)
        ? response.data
        : response.data?.products || [];

      const filteredProducts = productArray.filter(
        (p) =>
          p.topCategory === category ||
          p.secondCategory === category ||
          p.thirdCategory === category
      );

      setProducts(filteredProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to update cart. Please try again..");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchProducts();
      fetchCartFromBackend();
    } else {
      setProducts([]);
      setQuantities({});
    }

    const syncOnStorageChange = (e) => {
      if (e.key === getCartStorageKey()) {
        fetchCartFromBackend();
        setReloadFlag(prev => !prev); // ✅ Trigger re-render
      }
    };

    window.addEventListener("storage", syncOnStorageChange);
    return () => window.removeEventListener("storage", syncOnStorageChange);
  }, [category, customerId, reloadFlag]); // ✅ Include reloadFlag here

  const getFirstImage = (product) => {
    const images = [
      product.imagePath1,
      product.imagePath2,
      product.imagePath3,
      product.imagePath4,
      product.imagePath5,
    ];
    return images.find((img) => !!img);
  };

  const handleProductClick = (productId) => {
    if (productId) navigate(`/product/${productId}`);
  };

  const updateCart = async (product, quantityChange) => {
    const productId = product.productId || product.id;
    const currentQty = quantities[productId] || 0;
    const newQty = currentQty + quantityChange;

    if (newQty < 0) return;

    try {
      if (newQty > 0) {
        await axios.post(`${CART_API_URL}/add`, null, {
          params: { customerId, productId, quantity: quantityChange },
        });
      } else {
        await axios.delete(`${CART_API_URL}/remove`, {
          params: { customerId, productId },
        });
      }

      await fetchCartFromBackend();

      // Update localStorage to sync with other tabs/pages
      const key = getCartStorageKey();
      let cart = JSON.parse(localStorage.getItem(key)) || [];

      const index = cart.findIndex((item) => (item.productId || item.id) === productId);
      if (index > -1) {
        if (newQty > 0) {
          cart[index].quantity = newQty;
        } else {
          cart.splice(index, 1);
        }
      } else if (newQty > 0) {
        cart.push({ ...product, quantity: newQty });
      }
      localStorage.setItem(key, JSON.stringify(cart));

      setReloadFlag(prev => !prev); // ✅ Trigger re-render manually

    } catch (error) {
      console.error("Cart update failed:", error);
      alert("Purchase This Product From Cart...");
    }
  };

  const incrementQuantity = (e, product) => {
    e.stopPropagation();
    if (!customerId) {
      alert("Please login to add products.");
      return;
    }
    updateCart(product, 1);
  };

  const decrementQuantity = (e, product) => {
    e.stopPropagation();
    updateCart(product, -1);
  };

  return (
    <div className="product-list-container">
      <h2>{category ? `Products in "${category}"` : "All Products"}</h2>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      <div className="product-grid">
        {!loading && !error && products.length === 0 && <div>No products found.</div>}

        {products.map((product) => {
          const productId = product.productId || product.id;
          const image = getFirstImage(product);
          const quantity = quantities[productId] || 0;

          return (
            <div
              key={productId}
              className="product-card"
              onClick={() => handleProductClick(productId)}
            >
              {image ? (
                <div className="image-wrapper">
                  <img src={image} alt={product.productName} className="product-thumbnail" />
                  {product.discountPercentage > 0 && (
                    <div className="discount">{product.discountPercentage}% Off</div>
                  )}
                </div>
              ) : (
                <div className="no-image">No Image</div>
              )}

              <div className="product-info">
                <h3>{product.productName}</h3>
                <div className="product-details-row">
                  <span className="size">{product.sizeName || "N/A"}</span>
                  <br />
                  <span className="discounted-price">
                    MRP ₹{Math.round(product.discountedPrice)}
                  </span>
                  <span className="actual-price">
                    ₹<del>{Math.round(product.price)}</del>
                  </span>
                </div>
              </div>

              {quantity === 0 ? (
                <button
                  className="add-to-cart-button"
                  onClick={(e) => incrementQuantity(e, product)}
                >
                  ADD
                </button>
              ) : (
                <div
                  className="add-to-cart-button quantity-controls"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button onClick={(e) => decrementQuantity(e, product)}>-</button>
                  <span>{quantity}</span>
                  <button onClick={(e) => incrementQuantity(e, product)}>+</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
