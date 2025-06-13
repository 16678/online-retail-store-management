import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);

  // New states for addresses
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const DELIVERY_CHARGE_FIXED = 30;
  const HANDLING_CHARGE = 4;
  const SMALL_CART_CHARGE = 20;

  const customerId = localStorage.getItem("customerId");
  const getCartStorageKey = () => `cart_${customerId}`;

  // Sync cart with local storage
  const syncLocalStorageCart = (items) => {
    const cart = items.map(({ product, quantity }) => ({
      ...product,
      quantity,
    }));
    localStorage.setItem(getCartStorageKey(), JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Fetch cart items
  const fetchCartItems = async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:8086/api/cart/${customerId}`);
      setCartItems(data);
      syncLocalStorageCart(data);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved addresses from profile API
  const fetchAddresses = async () => {
    if (!customerId) return;
    try {
      const { data } = await axios.get(`http://localhost:8086/api/profile/addresses/${customerId}`);
      setAddresses(data);
      if (data.length > 0) setSelectedAddressId(data[0].id); // Select first address by default
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
    fetchAddresses();
  }, [customerId]);

  // Remove item from cart
  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:8086/api/cart/delete/${cartItemId}`);
      fetchCartItems();
    } catch (error) {
      console.error("Failed to remove item:", error);
      alert("Failed to remove item from cart.");
    }
  };

  // Quantity update
  const updateQuantity = async (productId, change) => {
    try {
      await axios.post(
        `http://localhost:8086/api/cart/add`,
        null,
        { params: { customerId, productId, quantity: change } }
      );
      fetchCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity.");
    }
  };

  const incrementQuantity = (productId) => updateQuantity(productId, 1);
  const decrementQuantity = (productId) => updateQuantity(productId, -1);

  // Calculate totals
  const calculateItemTotal = () =>
    cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const calculateCharges = () => {
    const itemTotal = calculateItemTotal();

    const delivery = itemTotal > 200 ? 0 : DELIVERY_CHARGE_FIXED;
    const smallCartCharge = itemTotal < 100 ? SMALL_CART_CHARGE : 0;

    return {
      itemTotal,
      delivery,
      handling: HANDLING_CHARGE,
      smallCart: smallCartCharge,
      grandTotal: itemTotal + delivery + HANDLING_CHARGE + smallCartCharge + tipAmount,
    };
  };

  // Handle input changes in Add Address form
  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new address to backend
  const handleAddAddress = async () => {
    // Simple validation
    if (
      !newAddress.name.trim() ||
      !newAddress.phone.trim() ||
      !newAddress.street.trim() ||
      !newAddress.city.trim() ||
      !newAddress.state.trim() ||
      !newAddress.pinCode.trim()
    ) {
      alert("Please fill all address fields.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8086/api/profile/address/add`, {
        customerId,
        ...newAddress,
      });

      if (response.status === 200 || response.status === 201) {
        alert("Address added successfully!");
        setShowAddAddressForm(false);
        setNewAddress({ name: "", phone: "", street: "", city: "", state: "", pinCode: "" });
        fetchAddresses();
      } else {
        alert("Failed to add address.");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Failed to add address.");
    }
  };

  // Confirm order with selected address
  const handleConfirmPayment = async () => {
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

    if (!selectedAddress) {
      alert("Please select or add a delivery address.");
      return;
    }

    const { grandTotal } = calculateCharges();

    // Construct delivery location string
    const deliveryLocation = `${selectedAddress.name}, ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pinCode}`;

    const orderData = {
      customerId,
      paymentMethod,
      totalAmount: grandTotal,
      deliveryLocation,
      items: cartItems.map(({ product, quantity }) => ({
        productId: product.productId || product.id,
        productName: product.productName || "Unknown",
        quantity,
        price: product.price,
      })),
    };

    try {
      const response = await axios.post('http://localhost:8086/api/orders/place', orderData);

      if (response.status === 200 || response.status === 201) {
        alert(`✅ Order placed successfully using ${paymentMethod}\n💰 Total: ₹${grandTotal.toFixed(2)}`);

        await Promise.all(
          cartItems.map(({ id }) =>
            axios.delete(`http://localhost:8086/api/cart/delete/${id}`)
          )
        );

        setCartItems([]);
        localStorage.removeItem(getCartStorageKey());
        window.dispatchEvent(new Event("cartUpdated"));
        setShowPaymentModal(false);
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  if (loading) return <p>Loading your cart...</p>;
  if (!cartItems.length) return <p className="empty-cart-message">🛒 Your cart is empty!</p>;

  const { itemTotal, delivery, handling, smallCart, grandTotal } = calculateCharges();

  return (
    <div className="cart-container">
      <h1 className="cart-title">🛍️ Your Cart</h1>

      {/* Cart Table */}
      <div className="cart-table-container">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(({ id, product, quantity }) => {
              const productId = product.productId || product.id;
              const itemTotal = (product.price * quantity).toFixed(2);

              return (
                <tr key={id}>
                  <td>
                    {product.imagePath1 ? (
                      <img
                        src={`http://localhost:8086/images/${product.imagePath1}`}
                        alt={product.productName}
                        className="product-img"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>{product.productName}</td>
                  <td>₹{Math.round(product.price)}</td>
                  <td>
                    <button onClick={() => decrementQuantity(productId)} disabled={quantity <= 1}>-</button>
                    <span className="mx-2">{quantity}</span>
                    <button onClick={() => incrementQuantity(productId)}>+</button>
                  </td>
                  <td>₹{itemTotal}</td>
                  <td>
                    <button onClick={() => handleRemoveFromCart(id)}>❌ Remove</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bill Summary */}
      <div className="bill-section">
        <h3>🧾 Bill Details</h3>
        <p>Items Total: ₹{itemTotal.toFixed(2)}</p>
        <p>Delivery Charge: ₹{delivery}</p>
        <p>Handling Charge: ₹{handling}</p>
        {smallCart > 0 && <p>Small Cart Charge: ₹{smallCart}</p>}
        <p>Tip for Delivery Partner: ₹{tipAmount}</p>
        <h3>Total: ₹{grandTotal.toFixed(2)}</h3>

        <div className="tip-section">
          <label>Add a tip:</label>
          {[20, 30, 50].map((amount) => (
            <button key={amount} onClick={() => setTipAmount(amount)}>
              ₹{amount}
            </button>
          ))}
          <input
            type="number"
            placeholder="Custom"
            min="0"
            onChange={(e) => setTipAmount(Number(e.target.value))}
          />
        </div>
      </div>

      <button className="checkout-button" onClick={() => setShowPaymentModal(true)}>
        🚀 Place Order
      </button>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Select Payment Method</h3>
            <div className="payment-options">
              {["COD", "UPI", "CARD"].map((method) => (
                <label key={method}>
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  {method === "COD" && "Cash on Delivery"}
                  {method === "UPI" && "UPI / PhonePe / Google Pay"}
                  {method === "CARD" && "Credit / Debit Card"}
                </label>
              ))}
            </div>

            {/* Address selection */}
            <div style={{ marginTop: "1rem" }}>
              <h4>Select Delivery Address:</h4>
              {addresses.length === 0 && <p>No saved addresses.</p>}

              {addresses.map(addr => (
                <div key={addr.id} style={{ marginBottom: "0.5rem" }}>
                  <input
                    type="radio"
                    id={`addr-${addr.id}`}
                    name="selectedAddress"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />
                  <label htmlFor={`addr-${addr.id}`}>
                    {addr.name}, {addr.street}, {addr.city}, {addr.state} - {addr.pinCode}, 📞 {addr.phone}
                  </label>
                </div>
              ))}

              <button
                style={{ marginTop: "1rem" }}
                onClick={() => setShowAddAddressForm((prev) => !prev)}
              >
                {showAddAddressForm ? "Cancel Adding Address" : "Add New Address"}
              </button>

              {showAddAddressForm && (
                <div className="add-address-form" style={{ marginTop: "1rem" }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={newAddress.name}
                    onChange={handleNewAddressChange}
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={newAddress.phone}
                    onChange={handleNewAddressChange}
                    required
                  />
                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    value={newAddress.street}
                    onChange={handleNewAddressChange}
                    required
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={handleNewAddressChange}
                    required
                  />
                  <input
                    type="text"
                    name="pinCode"
                    placeholder="Pin Code"
                    value={newAddress.pinCode}
                    onChange={handleNewAddressChange}
                    required
                  />
                  <button onClick={handleAddAddress} style={{ marginTop: "0.5rem" }}>
                    Save Address
                  </button>
                </div>
              )}
            </div>

            <div className="modal-buttons" style={{ marginTop: "1rem" }}>
              <button className="checkout-button" onClick={handleConfirmPayment}>
                Confirm
              </button>
              <button className="cancel-button" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
