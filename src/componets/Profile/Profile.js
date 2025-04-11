import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve customer data from localStorage
    const storedCustomer = JSON.parse(localStorage.getItem("customer"));

    if (storedCustomer) {
      setCustomer(storedCustomer);
    } else {
      navigate("/register"); // Redirect to registration if no user data is found
    }
  }, [navigate]);

  return (
    <div className="profile-container">
      {customer ? (
        <div className="profile-card">
          <h2>Welcome, {customer.customername}!</h2>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.phoneNumber}</p>
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem("customer");
            navigate("/register"); // Redirect to register after logout
          }}>
            Logout
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
export default Profile;
