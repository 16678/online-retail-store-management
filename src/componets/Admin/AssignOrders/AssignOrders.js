import React, { useState, useEffect } from 'react';
import './ReportsDashboard.css';

const AssignOrders = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [selectedDeliveryBoyId, setSelectedDeliveryBoyId] = useState("");

  useEffect(() => {
    // Static delivery boy list
    setDeliveryBoys([
      { id: 14, name: 'Ravi Kumar' },
      { id: 15, name: 'Suresh' },
    ]);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url = selectedDeliveryBoyId
          ? `http://localhost:8086/api/orders/delivery-boy/${selectedDeliveryBoyId}`
          : 'http://localhost:8086/api/orders';

        const response = await fetch(url);
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [selectedDeliveryBoyId]);

  return (
    <div className="assign-orders-container">
      <h2>Orders Assigned to Delivery Boys</h2>

      <div className="filter-section">
        <label><strong>Filter by Delivery Boy: </strong></label>
        <select
          value={selectedDeliveryBoyId}
          onChange={e => setSelectedDeliveryBoyId(e.target.value)}
        >
          <option value="">-- View All Orders --</option>
          {deliveryBoys.map(boy => (
            <option key={boy.id} value={boy.id}>
              {boy.name} (ID: {boy.id})
            </option>
          ))}
        </select>
      </div>

      {orders.length > 0 ? (
        orders.map(order => {
          const customer = order.customer || {};
          const items = order.items || [];

          return (
            <div key={order.id} className="order-card">
              <h3>Order ID: {order.id}</h3>

              <p><strong>Customer ID:</strong> {customer.customerId || "N/A"}</p>
              <p><strong>Customer Name:</strong> {customer.customerName || "N/A"}</p>
              <p><strong>Phone:</strong> {customer.phoneNumber || "N/A"}</p>
              <p><strong>Address:</strong> {customer.address || "N/A"}</p>

              <p><strong>Delivery Location:</strong> {order.deliveryLocation || "N/A"}</p>

              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total Amount:</strong> ₹{order.totalAmount?.toFixed(2) || "0.00"}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod || "Cash on Delivery"}</p>
              <p><strong>Order Time:</strong> {order.orderDate ? new Date(order.orderDate).toLocaleString() : "N/A"}</p>

              <h4>Items:</h4>
              {items.length > 0 ? (
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id}>
                        <td>{item.productId || 'N/A'}</td>
                        <td>{item.productName || 'N/A'}</td>
                        <td>₹{item.price?.toFixed(2) || '0.00'}</td>
                        <td>{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No items found for this order.</p>
              )}
            </div>
          );
        })
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default AssignOrders;
