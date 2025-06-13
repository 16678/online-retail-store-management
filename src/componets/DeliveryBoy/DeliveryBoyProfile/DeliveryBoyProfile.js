import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import './DeliveryBoyProfile.css';
import {
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaMotorcycle,
  FaEdit,
  FaStar,
  FaToggleOn,
  FaToggleOff,
  FaDollarSign,
} from "react-icons/fa";

const DeliveryBoyProfile = () => {
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // Get deliveryBoyId from location state or localStorage fallback
  const deliveryBoyId = location.state?.deliveryBoyId || localStorage.getItem('deliveryBoyId');

  useEffect(() => {
    if (!deliveryBoyId) {
      // If no ID, redirect to login page
      navigate('/delivery-login');
      return;
    }

    // Save deliveryBoyId to localStorage to persist on refresh
    localStorage.setItem('deliveryBoyId', deliveryBoyId);

    // Fetch delivery boy data
    const fetchDeliveryBoy = async () => {
      try {
        const response = await axios.get(`http://localhost:8086/api/deliveryboys/${deliveryBoyId}`);
        setDeliveryBoy(response.data);
      } catch (error) {
        console.error("Error fetching delivery boy data:", error);
      }
    };

    fetchDeliveryBoy();
  }, [deliveryBoyId, navigate]);

  // Toggle online/offline status
  const toggleStatus = () => setIsOnline(!isOnline);

  if (!deliveryBoy) {
    return <div className="loading">Loading delivery boy details...</div>;
  }

  const fullAddress = `${deliveryBoy.street || ''}, ${deliveryBoy.city || ''}, ${deliveryBoy.state || ''} - ${deliveryBoy.pincode || ''}`;

  // Use deliveryBoy.imageUrl if available, otherwise fallback to placeholder
  const profileImage = deliveryBoy.imageUrl 
    ? deliveryBoy.imageUrl.startsWith('http') 
      ? deliveryBoy.imageUrl // absolute URL from backend
      : `http://localhost:8086/${deliveryBoy.imageUrl}` // relative path, adjust if needed
    : "https://i.pravatar.cc/150?img=67";

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img src={profileImage} alt="Delivery Boy" className="profile-img" />
          <h2>{deliveryBoy.firstName} {deliveryBoy.lastName}</h2>
          <p>ID: DB{deliveryBoy.id}</p>
        </div>

        <div className="status-toggle" onClick={toggleStatus} style={{cursor: 'pointer'}}>
          {isOnline ? (
            <>
              <FaToggleOn className="toggle-icon online" /> Online
            </>
          ) : (
            <>
              <FaToggleOff className="toggle-icon offline" /> Offline
            </>
          )}
        </div>

        <div className="stats">
          <div className="stat-item">
            <FaMotorcycle className="stat-icon" />
            <h4>7</h4>
            <p>Today's Deliveries</p>
          </div>
          <div className="stat-item">
            <FaStar className="stat-icon" />
            <h4>4.9</h4>
            <p>Rating</p>
          </div>
          <div className="stat-item">
            <FaDollarSign className="stat-icon" />
            <h4>₹950</h4>
            <p>Today's Earnings</p>
          </div>
        </div>

        <div className="contact-info">
          <h3>Contact Details</h3>
          <p><FaPhone /> {deliveryBoy.phone}</p>
          <p><FaEnvelope /> {deliveryBoy.email}</p>
          <p><FaMapMarkerAlt /> {fullAddress || "Not Available"}</p>
        </div>

        <div className="zone-info">
          <h3>Delivery Zones</h3>
          <ul>
            <li>Madhapur</li>
            <li>Kondapur</li>
            <li>Gachibowli</li>
            <li>HiTech City</li>
          </ul>
        </div>

        <button className="edit-btn">
          <FaEdit /> Edit Profile
        </button>
      </div>
    </div>
  );
};

export default DeliveryBoyProfile;
