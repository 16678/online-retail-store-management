import React, { useState } from "react";
import "./DeliveryHome.css";

const DeliveryHome = () => {
  const [isOnline, setIsOnline] = useState(true);

  const toggleStatus = () => {
    setIsOnline((prev) => !prev);
  };

  const deliveriesToday = 7;
  const earnings = {
    today: "₹300",
    week: "₹1650",
  };

  const pendingTasks = [
    "Deliver order #9876",
    "Pickup order from 'Biryani House'",
    "Call customer of order #9844",
  ];

  const notifications = [
    "🆕 New order assigned: #9876",
    "⏰ Delay reported on order #9832",
    "✅ Order #9821 delivered successfully",
  ];

  return (
    <div className="delivery-home">
      <h2>Welcome, Pradeep 👋</h2>

      <div className="status-toggle">
        <label>Status:</label>
        <button onClick={toggleStatus} className={isOnline ? "online" : "offline"}>
          {isOnline ? "🟢 Online" : "🔴 Offline"}
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>📦 Today's Deliveries</h3>
          <p className="big-number">{deliveriesToday}</p>
        </div>

        <div className="card">
          <h3>💰 Earnings</h3>
          <p>Today: {earnings.today}</p>
          <p>This Week: {earnings.week}</p>
        </div>

        <div className="card">
          <h3>📋 Pending Tasks</h3>
          <ul>
            {pendingTasks.map((task, index) => (
              <li key={index}>🔸 {task}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>🔔 Notifications</h3>
          <ul>
            {notifications.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DeliveryHome;
