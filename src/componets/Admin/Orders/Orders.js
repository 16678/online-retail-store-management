import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

const DeliveryBoyAssign = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [assigningOrderId, setAssigningOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchDeliveryBoys();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8086/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const fetchDeliveryBoys = async () => {
    try {
      const response = await axios.get("http://localhost:8086/api/deliveryboys");
      setDeliveryBoys(response.data);
    } catch (error) {
      console.error("Failed to fetch delivery boys:", error);
    }
  };

  const handleAssignChange = (orderId, deliveryBoyId) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, assignedTo: deliveryBoyId } : order
      )
    );
  };

  const handleAssignSubmit = async (order) => {
    if (!order.assignedTo) {
      alert("Please select a delivery boy before assigning.");
      return;
    }

    try {
      setAssigningOrderId(order.id);
      const deliveryBoyId = parseInt(order.assignedTo);
      const url = `http://localhost:8086/api/orders/${order.id}/assign/${deliveryBoyId}`;
      await axios.put(url);
      alert("Delivery boy assigned successfully!");
      fetchOrders();
    } catch (error) {
      console.error("Assignment error:", error);
      alert(`Failed to assign delivery boy: ${error.response?.data || error.message}`);
    } finally {
      setAssigningOrderId(null);
    }
  };

  return (
    <div className="delivery-assign-container">
      <h2>Assign Delivery Boy</h2>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Order Date</th>
            <th>Order ID</th>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Location</th>
            <th>Payment Method</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Items</th>
            <th>Assign To</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.id}>
              <td>{index + 1}</td>
              <td>{new Date(order.orderDate).toLocaleString()}</td>
              <td>{order.id}</td>
              <td>{order.customer?.customerId || "N/A"}</td>
              <td>{order.customer?.customerName || "N/A"}</td>
              <td>{order.customer?.address || "N/A"}</td>
              <td>{order.paymentMethod}</td>
              <td>₹{order.totalAmount}</td>
              <td>{order.status}</td>
              <td>
                <ul>
                  {order.items?.map((item, idx) => (
                    <li key={idx}>
                      {item.productName} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <select
                  value={order.assignedTo || ""}
                  onChange={(e) => handleAssignChange(order.id, e.target.value)}
                >
                  <option value="">-- Select Delivery Boy --</option>
                  {deliveryBoys.map((boy) => (
                    <option key={boy.id} value={boy.id}>
                      {boy.name ? `${boy.name} (ID: ${boy.id})` : `ID: ${boy.id}`}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  className="assign-btn"
                  onClick={() => handleAssignSubmit(order)}
                  disabled={assigningOrderId === order.id}
                >
                  {assigningOrderId === order.id ? "Assigning..." : "Assign"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryBoyAssign;
