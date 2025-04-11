import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Headers.css";

const Headers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCustomer = JSON.parse(localStorage.getItem("customer"));
    setIsLoggedIn(!!storedCustomer); // Update login state based on user data
  }, []);

  const handleSearch = () => {
    navigate(`/search?query=${searchTerm}`);
  };

  return (
    <div>
      <header className="header">
        <div className="logo">Sarat Online Retail Store</div>

        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search by category, sub-category, or title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div>
          {isLoggedIn ? (
            <span className="profile" onClick={() => navigate("/profile")}>
              👤 Profile
            </span>
          ) : (
            <span className="profile" onClick={() => navigate("/login")}>
              🔑 Login
            </span>
          )}
          <span className="profile" onClick={() => navigate("/cart")}>
            🛒 Cart
          </span>
          <span className="profile" onClick={() => navigate("/adminLogin")}>
            🔑 Admin
          </span>
        </div>
      </header>
    </div>
  );
};

export default Headers;
