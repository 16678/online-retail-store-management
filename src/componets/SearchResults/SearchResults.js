import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../ProductList/ProductList.css";

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setError(null);

    fetch(`http://localhost:8086/api/product-search?q=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        const productsArray = Array.isArray(data) ? data : data?.products || [];
        setProducts(productsArray);

        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        const quantityMap = {};
        storedCart.forEach(item => {
          quantityMap[item.productId || item.id] = item.quantity;
        });
        setQuantities(quantityMap);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query]);

  // Fix: Prefix with image base URL if needed
  const getFirstImage = (product) => {
    const imageFields = [
      product.imagePath1,
      product.imagePath2,
      product.imagePath3,
      product.imagePath4,
      product.imagePath5,
    ];
    const image = imageFields.find(Boolean);
    return image ? `http://localhost:8086/images/${image}` : null; // Update this path as needed
  };

  const handleProductClick = (productId) => {
    if (productId) navigate(`/product/${productId}`);
  };

  const updateCart = (product, quantity) => {
    const id = product.productId || product.id;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex(item => item.productId === id || item.id === id);

    if (index > -1) {
      if (quantity > 0) cart[index].quantity = quantity;
      else cart.splice(index, 1);
    } else if (quantity > 0) {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const id = product.productId || product.id;
    const newQuantities = { ...quantities, [id]: 1 };
    setQuantities(newQuantities);
    updateCart(product, 1);
  };

  const incrementQuantity = (e, product) => {
    e.stopPropagation();
    const id = product.productId || product.id;
    const newQty = (quantities[id] || 0) + 1;
    setQuantities({ ...quantities, [id]: newQty });
    updateCart(product, newQty);
  };

  const decrementQuantity = (e, product) => {
    e.stopPropagation();
    const id = product.productId || product.id;
    const newQty = (quantities[id] || 1) - 1;

    if (newQty <= 0) {
      const newQuantities = { ...quantities };
      delete newQuantities[id];
      setQuantities(newQuantities);
    } else {
      setQuantities({ ...quantities, [id]: newQty });
    }

    updateCart(product, newQty);
  };

  return (
    <div className="product-list-container">
      <h2>Search Results for "{query}"</h2>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      <div className="product-grid">
        {!loading && !error && products.length === 0 && (
          <div>No products found for "{query}"</div>
        )}

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
                  <span className="size">{product.sizeName || "N/A"}</span><br />
                  <span className="discounted-price">MRP ₹{Math.round(product.discountedPrice)}  </span>
                  <span className="actual-price">₹<del>{Math.round(product.price)}</del></span>
                </div>
              </div>

              {quantity === 0 ? (
                <button
                  className="add-to-cart-button"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  ADD
                </button>
              ) : (
                <div className="add-to-cart-button quantity-controls" onClick={(e) => e.stopPropagation()}>
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

export default SearchResults;
