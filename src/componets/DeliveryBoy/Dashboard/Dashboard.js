import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "@fontsource/poppins";
import "./Dashboard.css";

import {
  FaHome,
  FaUser,
  FaBox,
  FaHistory
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Delivery Dashboard</h1>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-item" onClick={() => navigate("/Delivery/DashBoard")}>
            <FaHome className="sidebar-icon home-icon" />
            <span>Home</span>
          </div>
          <div className="sidebar-item" onClick={() => navigate("/Delivery/Profile")}>
            <FaUser className="sidebar-icon profile-icon" />
            <span>Profile</span>
          </div>
          <div className="sidebar-item" onClick={() => navigate("/Delivery/DeliveryAssignedOrders")}>
            <FaBox className="sidebar-icon orders-icon" />
            <span>Assigned Orders</span>
          </div>
          <div className="sidebar-item" onClick={() => navigate("/Delivery/OrdersPage")}>
            <FaHistory className="sidebar-icon history-icon" />
            <span>Order History</span>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
