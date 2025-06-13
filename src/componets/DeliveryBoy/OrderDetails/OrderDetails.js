import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./OrderDetails.css";

const DeliveredOrders = () => {
  const location = useLocation();

  // Step 1: Get deliveryBoyId from state or localStorage
  const deliveryBoyId = location.state?.deliveryBoyId || localStorage.getItem("deliveryBoyId");

  const [orders, setOrders] = useState([]);
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Step 2: Fetch delivery boy details (if needed)
  useEffect(() => {
    if (!deliveryBoyId) {
      setError("Delivery boy ID not found.");
      setLoading(false);
      return;
    }

    localStorage.setItem("deliveryBoyId", deliveryBoyId); // Persist ID

    const fetchDeliveryBoy = async () => {
      try {
        const response = await axios.get(`http://localhost:8086/api/deliveryboys/${deliveryBoyId}`);
        setDeliveryBoy(response.data);
      } catch (err) {
        console.error("Error fetching delivery boy details:", err);
      }
    };

    fetchDeliveryBoy();
  }, [deliveryBoyId]);

  // Step 3: Fetch delivered orders
  useEffect(() => {
    if (!deliveryBoyId) return;

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8086/api/orders/delivery-boy/${deliveryBoyId}/delivered`
        );
        if (response.data && response.data.length > 0) {
          setOrders(response.data);
        } else {
          setError("No delivered orders found.");
        }
      } catch (err) {
        console.error("Error fetching delivered orders:", err);
        setError("Failed to fetch delivered orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [deliveryBoyId]);

  if (loading) return <div>Loading delivered orders...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="delivered-orders">
      <h2>Delivered Orders for {deliveryBoy?.firstName || "Delivery Boy"} 📦</h2>
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <p><strong>Order ID:</strong> #{order.id}</p>
       
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>
          <p><strong>Payment:</strong> {order.paymentMethod}</p>
          <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
          <p><strong>Customer:</strong> {order.customer.customerName}</p>
           <p><strong>Status:</strong>{" "}
             <span className={`status-badge ${order.status.toLowerCase()}`}>
                {order.status}
             </span>
            </p>
          <div className="items">
            <strong>Items:</strong>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.productName || `Product #${item.productId}`} - ₹{item.price} x {item.quantity}
                </li>
              ))}
            </ul>
           
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeliveredOrders;
