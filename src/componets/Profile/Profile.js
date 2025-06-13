import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Wallet,
  Gift,
  HelpCircle,
  Users,
  MapPin,
  Settings,
  LogOut,
  ShoppingBag,
} from "lucide-react";
import "./Profile.css";

const menuItems = [
  { id: "profile", label: "Profile", icon: <User size={18} /> },
  { id: "orders", label: "My Orders", icon: <ShoppingBag size={18} /> },
  { id: "balance", label: "Available Balance", icon: <Wallet size={18} /> },
  { id: "gift", label: "Zepto Cash & Gift Card", icon: <Gift size={18} /> },
  { id: "support", label: "Contact Support", icon: <HelpCircle size={18} /> },
  { id: "referrals", label: "View Referrals", icon: <Users size={18} /> },
  { id: "addresses", label: "Profile Addresses", icon: <MapPin size={18} /> },
  { id: "edit", label: "Edit Profile", icon: <Settings size={18} /> },
];

const API_BASE_URL = "http://localhost:8086/api/v1/customer";

const Profile = () => {
  const navigate = useNavigate();

  // Active tab state
  const [activeTab, setActiveTab] = useState("profile");

  // Customer profile info
  const [customer, setCustomer] = useState(null);

  // Editable profile fields for Edit tab
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // Addresses array for Profile Addresses tab (multiple addresses supported here)
  const [addresses, setAddresses] = useState([]);

  // Input for adding new address
  const [newAddress, setNewAddress] = useState("");

  // Orders array (for orders tab)
  const [orderHistory, setOrderHistory] = useState([]);

  // Load customer info from localStorage and fetch orders on mount
  useEffect(() => {
    const storedCustomer = JSON.parse(localStorage.getItem("customer"));

    if (!storedCustomer) {
      navigate("/login");
      return;
    }

    setCustomer(storedCustomer);

    // Prefill edit form
    setEditData({
      name: storedCustomer.customerName,
      phone: storedCustomer.phoneNumber || "",
      email: storedCustomer.email,
    });

    // Assuming customer.address can be a string or array, normalize to array
    if (storedCustomer.address) {
      if (Array.isArray(storedCustomer.address)) {
        setAddresses(storedCustomer.address.map((addr, i) => ({
          id: i + 1,
          location: addr,
          isEditing: false,
          updatedLocation: "",
        })));
      } else {
        setAddresses([{
          id: 1,
          location: storedCustomer.address,
          isEditing: false,
          updatedLocation: "",
        }]);
      }
    }

    // Fetch orders for this customer
    fetchOrders(storedCustomer.customerId);
  }, [navigate]);

  // Fetch orders from backend
  const fetchOrders = async (customerId) => {
    try {
      const response = await axios.get(`http://localhost:8086/api/orders/customer/${customerId}`);
      setOrderHistory(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("customer");
    navigate("/login");
  };

  // Update profile (name, phone, email)
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
      console.error(err);
    }
  };

  // Add new address
  const handleAddAddress = async () => {
    const trimmedAddress = newAddress.trim();
    if (!trimmedAddress) {
      alert("Address cannot be empty");
      return;
    }

    // For simplicity, here we add only one address to profile — 
    // extend backend API if multiple addresses supported
    try {
      const res = await axios.put(
        `${API_BASE_URL}/update-address/${customer.customerId}`,
        trimmedAddress,
        { headers: { "Content-Type": "text/plain" } }
      );
      setCustomer(res.data);
      localStorage.setItem("customer", JSON.stringify(res.data));
      // Update addresses state as well
      setAddresses(prev => [
        ...prev,
        {
          id: Date.now(),
          location: trimmedAddress,
          isEditing: false,
          updatedLocation: "",
        },
      ]);
      setNewAddress("");
      alert("Address added successfully!");
    } catch (err) {
      alert("Failed to add address");
      console.error(err);
    }
  };

  // Edit an address (enable input field)
  const handleEditAddress = (id) => {
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === id ? { ...addr, isEditing: true, updatedLocation: addr.location } : addr
      )
    );
  };

  // Save edited address
  const handleSaveAddress = async (id) => {
    const addrToUpdate = addresses.find((addr) => addr.id === id);
    if (!addrToUpdate) return;

    const trimmed = addrToUpdate.updatedLocation.trim();
    if (!trimmed) {
      alert("Address cannot be empty");
      return;
    }

    try {
      // Here again you update profile address in backend, assuming single address,
      // you might need to adjust backend to support multiple addresses for full functionality.
      const res = await axios.put(
        `${API_BASE_URL}/update-address/${customer.customerId}`,
        trimmed,
        { headers: { "Content-Type": "text/plain" } }
      );

      setCustomer(res.data);
      localStorage.setItem("customer", JSON.stringify(res.data));

      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === id ? { ...addr, location: trimmed, isEditing: false, updatedLocation: "" } : addr
        )
      );
      alert("Address updated!");
    } catch (err) {
      alert("Failed to update address");
      console.error(err);
    }
  };

  // Render orders with fixed shipping addresses (non-editable)
  const renderOrders = () => {
    if (!orderHistory.length) {
      return <p>No orders found.</p>;
    }

    return orderHistory.map((order) => (
      <div key={order.id} className="profile-order-card">
        <div className="order-header">
          <strong>Order ID:</strong> {order.id}{" "}
          <span className={`order-status ${order.status.toLowerCase()}`}>
            {order.status}
          </span>
        </div>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(order.orderDate).toLocaleString()}
        </p>
        <p>
          <strong>Total:</strong> ₹{order.totalAmount}
        </p>
        <p>
          <strong>Shipping Address:</strong>{" "}
          {order.shippingAddress || "Not specified"}
        </p>
        <div className="order-items">
          <strong>Items:</strong>
          <ul>
            {order.items?.map((item, idx) => (
              <li key={idx}>
                {item.productName} - ₹{item.price} × {item.quantity}
              </li>
            )) || <li>No items listed.</li>}
          </ul>
        </div>
      </div>
    ));
  };

  // Render profile addresses tab UI
  const renderAddressesTab = () => (
    <div>
      <h3>Profile Addresses</h3>
      {addresses.length === 0 && <p>No addresses available.</p>}
      {addresses.map(({ id, location, isEditing, updatedLocation }) => (
        <div key={id} className="profile-address-item">
          {isEditing ? (
            <>
              <input
                type="text"
                value={updatedLocation}
                onChange={(e) =>
                  setAddresses((prev) =>
                    prev.map((addr) =>
                      addr.id === id
                        ? { ...addr, updatedLocation: e.target.value }
                        : addr
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
          type="text"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          placeholder="Add new address"
          className="profile-input"
        />
        <button onClick={handleAddAddress}>Add Address</button>
      </div>
    </div>
  );

  // Render content based on active tab
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

      case "balance":
        return (
          <div>
            <h3>Available Balance</h3>
            <p>₹0</p>
          </div>
        );

      case "gift":
        return (
          <div>
            <h3>Zepto Cash & Gift Card</h3>
            <p>Free Cash: ₹100</p>
          </div>
        );

      case "support":
        return (
          <div>
            <h3>Contact Support</h3>
            <p>Support not available yet.</p>
          </div>
        );

      case "referrals":
        return (
          <div>
            <h3>Referrals</h3>
            <p>You have no referrals.</p>
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
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              placeholder="Name"
            />
            <input
              className="profile-input"
              value={editData.phone}
              onChange={(e) =>
                setEditData({ ...editData, phone: e.target.value })
              }
              placeholder="Phone Number"
            />
            <input
              className="profile-input"
              type="email"
              value={editData.email}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
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
                  className={`profile-menu-item ${
                    activeTab === item.id ? "profile-active" : ""
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="profile-icon">{item.icon}</span>
                  <span className="profile-label">{item.label}</span>
                </li>
              ))}
              <li
                className="profile-menu-item profile-logout"
                onClick={handleLogout}
              >
                <span className="profile-icon">
                  <LogOut size={18} />
                </span>
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
