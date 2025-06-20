import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Headers.css";
import logo from "./WhatsApp Image 2025-03-31 at 18.11.31_3db289b3.jpg"; // Update the path if needed
// import CurrentLocationMap from "../CurrentLocationMap/CurrentLocationMap";
const Headers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCustomer = JSON.parse(localStorage.getItem("customer"));
    setIsLoggedIn(!!storedCustomer);
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm !== "") {
      navigate(`/search?q=${encodeURIComponent(trimmedTerm)}`);
      setSearchTerm("");
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo" className="header-logo" />
        </Link>
      </div>
      
      <form
        className="search-input-wrapper"
        onSubmit={handleSearch}
        role="search"
        aria-label="Product Search Form"
      >
        <input
          type="search"
          placeholder="Search for Electronics,Cloths...
"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Search products"
          autoComplete="off"
        />
        <button
          type="submit"
          className="search-button"
          aria-label="Search button"
          disabled={searchTerm.trim() === ""}
        >
          Search
        </button>
      </form>

      <nav className="user-actions">
        {isLoggedIn ? (
          <button
            className="profile-btn"
            onClick={() => navigate("/profile")}
            aria-label="Go to Profile"
          >
            👤 Profile
          </button>
        ) : (
          <button
            className="profile-btn"
            onClick={() => navigate("/login")}
            aria-label="Login"
          >
            🔑 Login
          </button>
        )}

        <button
          className="profile-btn"
          onClick={() => navigate("/cart")}
          aria-label="View Cart"
        >
          🛒 Cart
        </button>

        <button
          className="profile-btn"
          onClick={() => navigate("/adminLogin")}
          aria-label="Admin Login"
        >
          🔑 Admin
        </button>
      </nav>
    </header>
  );
};

export default Headers;
