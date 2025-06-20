import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  ShoppingBag,
  HelpCircle,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react";
import "./Profile.css";

const menuItems = [
  { id: "profile", label: "Profile", icon: <User size={18} /> },
  { id: "orders", label: "My Orders", icon: <ShoppingBag size={18} /> },
  { id: "support", label: "Contact Support", icon: <HelpCircle size={18} /> },
  { id: "addresses", label: "Profile Addresses", icon: <MapPin size={18} /> },
  { id: "edit", label: "Edit Profile", icon: <Settings size={18} /> },
];

const API_BASE_URL = "http://localhost:8086/api/v1/customer";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [customer, setCustomer] = useState(null);
  const [editData, setEditData] = useState({ name: "", phone: "", email: "" });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    const storedCustomer = JSON.parse(localStorage.getItem("customer"));
    if (!storedCustomer) {
      navigate("/login");
      return;
    }
    setCustomer(storedCustomer);
    setEditData({
      name: storedCustomer.customerName,
      phone: storedCustomer.phoneNumber || "",
      email: storedCustomer.email,
    });

    const customerAddresses = Array.isArray(storedCustomer.address)
      ? storedCustomer.address
      : [storedCustomer.address];
    setAddresses(
      customerAddresses.map((addr, i) => ({
        id: i + 1,
        location: addr,
        isEditing: false,
        updatedLocation: "",
      }))
    );

    fetchOrders(storedCustomer.customerId);
  }, [navigate]);

  const fetchOrders = async (customerId) => {
    try {
      const res = await axios.get(
        `http://localhost:8086/api/orders/customer/${customerId}`
      );
      setOrderHistory(res.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("customer");
    navigate("/login");
  };

  const handleProfileUpdate = async () => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/update-profile/${customer.customerId}`,
        {
          customerName: editData.name,
          phoneNumber: editData.phone,
          email: editData.email,
        }
      );
      setCustomer(res.data);
      localStorage.setItem("customer", JSON.stringify(res.data));
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handleAddAddress = async () => {
    const trimmed = newAddress.trim();
    if (!trimmed) return alert("Address cannot be empty");

    try {
      const res = await axios.put(
        `${API_BASE_URL}/update-address/${customer.customerId}`,
        trimmed,
        { headers: { "Content-Type": "text/plain" } }
      );
      setCustomer(res.data);
      localStorage.setItem("customer", JSON.stringify(res.data));
      setAddresses((prev) => [
        ...prev,
        {
          id: Date.now(),
          location: trimmed,
          isEditing: false,
          updatedLocation: "",
        },
      ]);
      setNewAddress("");
    } catch (err) {
      alert("Failed to add address");
    }
  };

  const handleEditAddress = (id) => {
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === id
          ? { ...addr, isEditing: true, updatedLocation: addr.location }
          : addr
      )
    );
  };

  const handleSaveAddress = async (id) => {
    const addr = addresses.find((a) => a.id === id);
    if (!addr || !addr.updatedLocation.trim()) {
      return alert("Address cannot be empty");
    }

    try {
      const res = await axios.put(
        `${API_BASE_URL}/update-address/${customer.customerId}`,
        addr.updatedLocation.trim(),
        { headers: { "Content-Type": "text/plain" } }
      );
      setCustomer(res.data);
      localStorage.setItem("customer", JSON.stringify(res.data));
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, location: addr.updatedLocation, isEditing: false, updatedLocation: "" }
            : a
        )
      );
    } catch (err) {
      alert("Failed to update address");
    }
  };

  const renderOrders = () => {
    if (!orderHistory.length) return <p>No orders found.</p>;

    return orderHistory.map((order) => (
      <div key={order.id} className="profile-order-card">
        <div className="order-header">
          <strong>Order ID:</strong> {order.id}
          <span className={`order-status ${order.status.toLowerCase()}`}>
            {order.status}
          </span>
        </div>
        <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
        <p><strong>Total:</strong> ₹{order.totalAmount}</p>
        <p><strong>Shipping Address:</strong> {order.shippingAddress || "Not specified"}</p>
        <div className="order-items">
          <strong>Items:</strong>
          <ul>
            {order.items?.map((item, i) => (
              <li key={i}>
                {item.productName} - ₹{item.price} × {item.quantity}
              </li>
            )) || <li>No items listed.</li>}
          </ul>
        </div>
      </div>
    ));
  };

  const renderAddressesTab = () => (
    <div>
      <h3>Profile Addresses</h3>
      {!addresses.length && <p>No addresses available.</p>}
      {addresses.map(({ id, location, isEditing, updatedLocation }) => (
        <div key={id} className="profile-address-item">
          {isEditing ? (
            <>
              <input
                value={updatedLocation}
                onChange={(e) =>
                  setAddresses((prev) =>
                    prev.map((addr) =>
                      addr.id === id ? { ...addr, updatedLocation: e.target.value } : addr
                    )
                  )
                }
                className="profile-input"
              />
              <button onClick={() => handleSaveAddress(id)}>Save</button>
            </>
          ) : (
            <>
              <span>{location}</span>
              <button onClick={() => handleEditAddress(id)}>Edit</button>
            </>
          )}
        </div>
      ))}
      <div style={{ marginTop: "10px" }}>
        <input
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          placeholder="Add new address"
          className="profile-input"
        />
        <button onClick={handleAddAddress}>Add Address</button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (!customer) return <p>Loading...</p>;

    switch (activeTab) {
      case "profile":
        return (
          <div>
            <h2>{customer.customerName}</h2>
            <p>Phone: {customer.phoneNumber || "-"}</p>
            <p>Email: {customer.email || "-"}</p>
          </div>
        );
      case "orders":
        return <div>{renderOrders()}</div>;
      case "support":
        return (
          <div>
            <h3>Contact Support</h3>
            <p>Support not available yet.</p>
          </div>
        );
      case "addresses":
        return renderAddressesTab();
      case "edit":
        return (
          <div>
            <h3>Edit Profile</h3>
            <input
              className="profile-input"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              placeholder="Name"
            />
            <input
              className="profile-input"
              value={editData.phone}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              placeholder="Phone Number"
            />
            <input
              className="profile-input"
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              placeholder="Email"
            />
            <button onClick={handleProfileUpdate}>Update Profile</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-container">
      {customer ? (
        <div className="profile-layout">
          <aside className="profile-sidebar">
            <ul className="profile-menu">
              {menuItems.map((item) => (
                <li
                  key={item.id}
                  className={`profile-menu-item ${activeTab === item.id ? "profile-active" : ""}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="profile-icon">{item.icon}</span>
                  <span className="profile-label">{item.label}</span>
                </li>
              ))}
              <li className="profile-menu-item profile-logout" onClick={handleLogout}>
                <span className="profile-icon"><LogOut size={18} /></span>
                <span className="profile-label">Log Out</span>
              </li>
            </ul>
          </aside>
          <main className="profile-content">{renderContent()}</main>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
