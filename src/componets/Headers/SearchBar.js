import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SearchBar.css";

//import { addToCart } from "../Headers/Cart";
//import "./Cart";

const SearchBar = ({ searchQuery }) => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const apiUrl = category
        ? `http://127.0.0.1:8086/api/products/category/${category}`
        : "http://127.0.0.1:8086/api/products";
      const response = await fetch(apiUrl);
      const data = await response.json();
      const productsWithQuantity = data.map((product) => ({
        ...product,
        quantity: 1,
      }));
      setProducts(productsWithQuantity);
      setFilteredProducts(productsWithQuantity);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  useEffect(() => {
    const filtered = searchQuery
      ? products.filter(
          (product) =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : products;
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const updateQuantity = (productId, action) => {
    setFilteredProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              quantity: action === "increase" ? product.quantity + 1 : Math.max(1, product.quantity - 1),
            }
          : product
      )
    );
  };

  const handleAddToCart = (product) => {
    AddToCart(product);
  };

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">
       
      </h1>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <img
                src={product.imageUrl}
                alt={product.title}
                className="product-image"
              />
              <div className="product-info">
                <h2 className="product-title">{product.title}</h2>
                <p className="product-category">{product.category}</p>
                <p className="product-description">{product.description}</p>
                <p className="product-price">&#8377;{product.price}</p>
                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={() => updateQuantity(product.id, "decrease")}
                  >
                    −
                  </button>
                  <span className="quantity">{product.quantity}</span>
                  <button
                    className="quantity-button"
                    onClick={() => updateQuantity(product.id, "increase")}
                  >
                    +
                  </button>
                </div>
                <p
                  className="product-cart"
                  onClick={() => handleAddToCart(product)}
                >
                  🛒 ADD
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
};
export default SearchBar;
