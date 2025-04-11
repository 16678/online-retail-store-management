import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Cart.css";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get("http://localhost:8086/api/products")
      .then((res) => {
        const allProducts = res.data;
        const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];

        // Merge quantity info from savedCart into fetched products
        const mergedCart = savedCart.map((item) => {
          const product = allProducts.find((p) => p.id === item.id);
          return product ? { ...product, quantity: item.quantity } : null;
        }).filter(Boolean);

        setCartItems(mergedCart);
        setProducts(allProducts);
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  };

  const handleQuantityChange = (productId, action) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: action === "increase"
                ? item.quantity + 1
                : item.quantity > 1
                ? item.quantity - 1
                : 1,
            }
          : item
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Shopping Cart</h1>
      {cartItems.length > 0 ? (
        <div className="cart-table-container">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} className="cart-item-row">
                  <td>
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="cart-item-image"
                    />
                    {item.productName}
                  </td>
                  <td>₹{item.price}</td>
                  <td>
                    <div className="quantity-controls">
                      <button
                        className="quantity-button"
                        onClick={() => handleQuantityChange(item.id, "decrease")}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="quantity-button"
                        onClick={() => handleQuantityChange(item.id, "increase")}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      ❌ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-total">
            <p className="total-amount">Total Amount: ₹{totalAmount}</p>
            <button className="proceed-button">Proceed to Pay</button>
          </div>
        </div>
      ) : (
        <p className="empty-cart-message">Your cart is empty!</p>
      )}
    </div>
  );
};

export default Cart;
