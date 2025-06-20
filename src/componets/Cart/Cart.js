import React, { useEffect, useState } from "react";
import axios from "axios";
import useCustomerAddress from "../useCustomerAddress/useCustomerAddress";
import "./Cart.css";

const API_BASE = "http://localhost:8086/api";
const IMAGE_BASE = "http://localhost:8086/images";
const DELIVERY_CHARGE = 30;
const HANDLING_CHARGE = 4;
const SMALL_CART_CHARGE = 20;

const Cart = () => {
  const [customerId, setCustomerId] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [tipAmount, setTipAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [confirmedAddress, setConfirmedAddress] = useState(null);

  const {
    addresses,
    newAddress,
    setNewAddress,
    handleAddAddress,
    handleEditAddress,
    handleSaveAddress,
    setAddresses,
  } = useCustomerAddress({ customerId });

  // Fetch customer from localStorage
  useEffect(() => {
    const customerData = localStorage.getItem("customer");
    if (customerData) {
      const customer = JSON.parse(customerData);
      setCustomerId(customer.customerId);
      setCustomerName(customer.customerName);
    } else {
      alert("Please log in to view your cart.");
    }
  }, []);

  const getCartKey = () => `cart_${customerId}`;

  const syncCartToStorage = (items) => {
    const simplifiedCart = items.map(({ product, quantity }) => ({ ...product, quantity }));
    localStorage.setItem(getCartKey(), JSON.stringify(simplifiedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const fetchCartItems = async () => {
    if (!customerId) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/cart/${customerId}`);
      setCartItems(res.data);
      syncCartToStorage(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [customerId]);

  useEffect(() => {
    if (addresses.length && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  const updateQuantity = async (productId, delta) => {
    try {
      await axios.post(`${API_BASE}/cart/add`, null, {
        params: { customerId, productId, quantity: delta },
      });
      fetchCartItems();
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await axios.delete(`${API_BASE}/cart/delete/${cartItemId}`);
      fetchCartItems();
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const calculateCharges = () => {
    const itemTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const delivery = itemTotal > 200 ? 0 : DELIVERY_CHARGE;
    const smallCart = itemTotal < 100 ? SMALL_CART_CHARGE : 0;
    const grandTotal = itemTotal + delivery + HANDLING_CHARGE + smallCart + tipAmount;

    return { itemTotal, delivery, smallCart, grandTotal };
  };

  const handleConfirmPayment = async () => {
    const address = addresses.find((a) => a.id === selectedAddressId);
    if (!address) return alert("Please select an address.");
    if (!customerId || !customerName) return alert("Customer info missing.");

    const { grandTotal } = calculateCharges();

    const orderPayload = {
      customerId,
      customerName,
      deliveryLocation: address.location,
      paymentMethod,
      totalAmount: grandTotal,
      items: cartItems.map(({ product, quantity }) => ({
        productId: product.productId || product.id,
        productName: product.productName,
        quantity,
        price: product.price,
      })),
    };

    try {
      await axios.post(`${API_BASE}/orders/place`, orderPayload);
      alert(`✅ Order placed via ${paymentMethod}`);
      for (const item of cartItems) {
        await axios.delete(`${API_BASE}/cart/delete/${item.id}`);
      }
      setCartItems([]);
      localStorage.removeItem(getCartKey());
      window.dispatchEvent(new Event("cartUpdated"));
      setConfirmedAddress(address.location);
      setShowPaymentModal(false);
    } catch (err) {
      console.error("Order failed:", err);
      alert("❌ Order placement failed");
    }
  };

  const { itemTotal, delivery, smallCart, grandTotal } = calculateCharges();

  if (loading) return <p>Loading cart...</p>;
  if (!cartItems.length) return <p className="empty-cart-message">🛒 Your cart is empty!</p>;

  return (
    <div className="cart-container">
      <h1 className="cart-title">🛍️ Your Cart</h1>

      <table className="cart-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(({ id, product, quantity }) => (
            <tr key={id}>
              <td>
                {product.imagePath1 ? (
                  <img
                    src={`${IMAGE_BASE}/${product.imagePath1}`}
                    alt={product.productName}
                    className="product-img"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>{product.productName}</td>
              <td>₹{product.price.toFixed(2)}</td>
              <td>
                <button onClick={() => updateQuantity(product.id, -1)} disabled={quantity <= 1}>-</button>
                <span>{quantity}</span>
                <button onClick={() => updateQuantity(product.id, 1)}>+</button>
              </td>
              <td>₹{(product.price * quantity).toFixed(2)}</td>
              <td>
                <button onClick={() => removeItem(id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bill-section">
        <h3>🧾 Bill Details</h3>
        <p>Items Total: ₹{itemTotal.toFixed(2)}</p>
        <p>Delivery: ₹{delivery}</p>
        <p>Handling: ₹{HANDLING_CHARGE}</p>
        {smallCart > 0 && <p>Small Cart Fee: ₹{smallCart}</p>}
        <p>Tip: ₹{tipAmount}</p>
        <h3>Total: ₹{grandTotal.toFixed(2)}</h3>

        <div className="tip-section">
          <label>Tip your delivery partner:</label>
          {[20, 30, 50].map((amt) => (
            <button key={amt} onClick={() => setTipAmount(amt)}>₹{amt}</button>
          ))}
          <input
            type="number"
            placeholder="Custom"
            value={tipAmount}
            onChange={(e) => setTipAmount(Number(e.target.value) || 0)}
          />
        </div>
      </div>

      {confirmedAddress && (
        <div className="confirmed-address">
          <h4>📍 Delivery Address:</h4>
          <p>{confirmedAddress}</p>
        </div>
      )}

      <button className="checkout-button" onClick={() => setShowPaymentModal(true)}>
        🚀 Place Order
      </button>

      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Select Payment Method</h3>
            {["COD", "UPI", "CARD"].map((method) => (
              <label key={method}>
                <input
                  type="radio"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                {method}
              </label>
            ))}

            <h4>📍 Delivery Address</h4>
            {addresses.length === 0 ? (
              <p style={{ fontStyle: "italic", color: "gray" }}>No address found. Please add one.</p>
            ) : (
              addresses.map(({ id, location, isEditing, updatedLocation }) => (
                <div key={id} className="profile-address-item">
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === id}
                    onChange={() => setSelectedAddressId(id)}
                  />
                  {isEditing ? (
                    <>
                      <input
                        value={updatedLocation}
                        onChange={(e) =>
                          setAddresses((prev) =>
                            prev.map((addr) =>
                              addr.id === id ? { ...addr, updatedLocation: e.target.value } : addr
                            )
                          )
                        }
                      />
                      <button onClick={() => handleSaveAddress(id)}>Save</button>
                    </>
                  ) : (
                    <>
                      <span>{location}</span>
                      <button onClick={() => handleEditAddress(id)}>Edit</button>
                    </>
                  )}
                </div>
              ))
            )}

            <div className="new-address">
              <input
                placeholder="New address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
              <button onClick={handleAddAddress}>Add</button>
            </div>

            <div className="modal-buttons">
              <button onClick={handleConfirmPayment}>Confirm</button>
              <button onClick={() => setShowPaymentModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
