import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssignedOrders = () => {
  const [deliveryBoyId, setDeliveryBoyId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const idFromStorage = localStorage.getItem('deliveryBoyId');
    setDeliveryBoyId(idFromStorage);

    if (!idFromStorage) {
      setError('⚠️ Delivery Boy ID not found. Please login again.');
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8086/api/orders/delivery-boy/${idFromStorage}`
        );
        const assignedOrders = response.data.filter(order => order.status === 'Assigned');
        setOrders(assignedOrders);
        setError('');
      } catch (err) {
        console.error('Error fetching assigned orders:', err);
        setError('❌ Failed to fetch assigned orders.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const markAsDelivered = async (orderId) => {
    try {
      await axios.put(`http://localhost:8086/api/orders/${orderId}/deliver`);

      // Remove the order from assigned list after marking as delivered
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));

      alert('✅ Order marked as Delivered');
    } catch (err) {
      console.error('Failed to mark as delivered:', err);
      alert('❌ Error updating delivery status. Please try again.');
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">📦 Assigned Orders</h2>

      {loading && <p className="text-blue-500">Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="text-gray-500">No assigned orders found.</p>
      )}

      {orders.map((order) => (
        <div key={order.id} className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Order ID: {order.id}</h3>
          <p><strong>Customer:</strong> {order.customer?.customerName ?? `ID: ${order.customerId}`}</p>
          <p><strong>Phone:</strong> {order.customer?.phoneNumber ?? 'N/A'}</p>
          <p><strong>Address:</strong> {order.customer?.address ?? 'N/A'}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong>Total Amount:</strong> ₹{order.totalAmount?.toFixed(2)}</p>
          <p><strong>Status:</strong> 
            <span className="ml-2 px-2 py-1 rounded text-white bg-yellow-600">
              {order.status}
            </span>
          </p>
          <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>

          <div className="mt-3">
            <strong>Items:</strong>
            <ul className="list-disc list-inside ml-4">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.productName ?? 'Product'} - ₹{item.price} × {item.quantity}
                </li>
              ))}
            </ul>
          </div>

          <button
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => markAsDelivered(order.id)}
          >
            Mark as Delivered
          </button>
        </div>
      ))}
    </div>
  );
};

export default AssignedOrders;
