import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./DeliveryHome.css";

const DeliveryHome = () => {
  const location = useLocation();

  // Try location state first, fallback to localStorage
  const deliveryBoyId = location.state?.deliveryBoyId || localStorage.getItem("deliveryBoyId");

  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    if (!deliveryBoyId) return;

    // Save to localStorage so it persists on refresh
    localStorage.setItem("deliveryBoyId", deliveryBoyId);

    const fetchDeliveryBoy = async () => {
      try {
        const response = await axios.get(`http://localhost:8086/api/deliveryboys/${deliveryBoyId}`);
        setDeliveryBoy(response.data);
      } catch (error) {
        console.error("Error fetching delivery boy data:", error);
      }
    };

    fetchDeliveryBoy();
  }, [deliveryBoyId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleStatus = () => setIsOnline((prev) => !prev);

  if (!deliveryBoy) {
    return <div>Loading delivery boy data...</div>;
  }

  return (
    <div className="delivery-home">
      <h2>Welcome, {deliveryBoy.firstName} 👋</h2>

      <div className="profile-info">
        <p>
          <strong>ID:</strong> DB{deliveryBoy.id}
        </p>
        <p>
          <strong>Contact:</strong> {deliveryBoy.phone}
        </p>
        <p>
          <strong>Shift Time:</strong> {deliveryBoy.workingHours || "Not set"}
        </p>
        <p>
          <strong>Current Time:</strong> {currentTime}
        </p>
      </div>

      <div className="status-toggle">
        <label>Status:</label>
        <button onClick={toggleStatus} className={isOnline ? "online" : "offline"}>
          {isOnline ? "🟢 Online" : "🔴 Offline"}
        </button>
      </div>

      <div className="dashboard-grid">{/* Your other dashboard cards here */}</div>
    </div>
  );
};

export default DeliveryHome;
