import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "@fontsource/poppins";
import "./Dashboard.css";

import {
  FaHome,
  FaUser,
  FaDollarSign,
  FaBox,
  FaClipboard,
  FaHistory,
  FaQrcode,
} from "react-icons/fa";

import { QrReader } from "react-qr-reader";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [deliveryQueue, setDeliveryQueue] = useState([]);
  const [scannedData, setScannedData] = useState(null);

  const handleScan = (result) => {
    if (result?.text && !deliveryQueue.includes(result.text)) {
      setScannedData(result.text);
      setDeliveryQueue((prevQueue) => [...prevQueue, result.text]);
      setShowScanner(false);
    }
  };

  const handleError = (error) => {
    console.error("QR Scan Error:", error);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Delivery Dashboard</h1>
        </div>
        <nav>
          <div className="sidebar-item" onClick={() => navigate("/Delivery/DashBoard")}>
            <FaHome className="sidebar-icon home-icon" /> Home
          </div>
          <div className="sidebar-item" onClick={() => navigate("/Delivery/Profile")}>
            <FaUser className="sidebar-icon profile-icon" /> Profile
          </div>
          <div className="sidebar-item" onClick={() => navigate("/Delivery/DeliveryEarnings")}>
            <FaDollarSign className="sidebar-icon earnings-icon" /> Earnings
          </div>
          <div className="sidebar-item" onClick={() => navigate("/Delivery/DeliveryAssignedOrders")}>
            <FaBox className="sidebar-icon orders-icon" /> Assigned Orders
          </div>
          <div className="sidebar-item" onClick={() => navigate("/Delivery/OrdersPage")}>
            <FaHistory className="sidebar-icon history-icon" />Order History
          </div>
      
           <div className="sidebar-item" onClick={() => navigate("/Delivery/DeliveryBoyScanner")}>
            <FaHistory className="sidebar-icon history-icon" /> Delivery DeliveryBoyScanner
          </div>
          
        </nav>
      </aside>

     
    </div>
  );
};

export default Dashboard;
