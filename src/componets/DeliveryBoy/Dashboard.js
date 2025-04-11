import React from "react";
import "./Dashboard.css"; // Import the CSS file

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1>Delivery Panel</h1>
        <nav>
          <a href="#">🏠 Home</a>
          <a href="#">👤 Profile</a>
          <a href="#">💰 Earnings</a>
          <a href="#">📦 Assigned Orders</a>
          <a href="#">📋 Order Details</a>
          <a href="#">📜 Delivery History</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="welcome-card">
          <h2>Welcome to the Delivery Panel</h2>
          <p>Select an option from the left sidebar to continue.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
