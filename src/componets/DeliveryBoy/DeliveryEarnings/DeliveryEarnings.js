import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DeliveryEarnings.css"; // Still using same styles

const API_URL = "http://localhost:8086/api/orders/delivered";

const DeliveredOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDeliveredOrders = async () => {
    try {
      const response = await axios.get(API_URL);
      const data = response.data || [];
      setOrders(data);
    } catch (err) {
      console.error("Error fetching delivered orders:", err);
      setError("Failed to load delivered orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveredOrders();
  }, []);

  if (loading) return <div>Loading delivered orders...</div>;
  if (error) return <div>{error}</div>;
  if (orders.length === 0) return <div>No delivered orders found.</div>;

  return (
    <div className="delivered-orders-container">
      <h2>Delivered Orders</h2>
      <div className="delivered-orders-list">
        {orders.map((order) => {
          const customerName = order?.customer?.customerName || "Unknown Customer";
          const productName = order?.product?.productName || "Unknown Product";
          const quantity = order?.quantity ?? "N/A";
          const deliveryDate = order?.deliveryDate || "N/A";

          return (
            <div key={order?.orderId || Math.random()} className="order-card">
              <p><strong>Customer:</strong> {customerName}</p>
              <p><strong>Product:</strong> {productName}</p>
              <p><strong>Quantity:</strong> {quantity}</p>
              <p><strong>Delivered On:</strong> {deliveryDate}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveredOrders;
