import React, { useState } from 'react';
import './Orders.css';

const Orders = () => {
  // Sample order data
  const [orders, setOrders] = useState([
    {
      orderId: 'ORD123',
      orderDate: '2024-12-10',
      deliveryAddress: '123 Main St, Springfield',
      productDetails: 'Product 1, Product 2',
      paymentType: 'Credit Card',
      status: 'Pending',
    },
    {
      orderId: 'ORD124',
      orderDate: '2024-12-11',
      deliveryAddress: '456 Elm St, Shelbyville',
      productDetails: 'Product 3',
      paymentType: 'PayPal',
      status: 'Shipped',
    },
  ]);

  // Update order status
  const handleUpdateStatus = (id, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.orderId === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  return (
    <div className="view-orders-container">
      <p>View Orders</p>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order Date</th>
            <th>Order ID</th>
            <th>Delivery Address</th>
            <th>Product Details</th>
            <th>Payment Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td>{order.orderDate}</td>
              <td>{order.orderId}</td>
              <td>{order.deliveryAddress}</td>
              <td>{order.productDetails}</td>
              <td>{order.paymentType}</td>
              <td>{order.status}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <button class="Update">Update</button>
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
