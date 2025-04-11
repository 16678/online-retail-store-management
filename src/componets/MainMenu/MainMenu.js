import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MainMenu.css";

function MainMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "Electronics",
    "Cloths",
    "Home & Furniture",
    "Books",
    "Vegetables & Fruits",
    "Diary & Breakfast",
    "Cold Drinks & Juices",
    "Instant Frozen Food",
    "Tea, Coffee & Frozen Drinks",
    "Bakery & Biscuits",
    "Atta, Rice & Dal",
    "Dry Fruits, Masala & Oil",
    "Personal Care",
    "Pet Care",
    "Beauty & Cosmetics",
    "Accessories"
  ];

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Navigate to category page and close dropdown
  const navigateToCategory = (category) => {
    navigate(`/category/${category}`);
    setIsDropdownOpen(false); // Close the dropdown
  };

  return (
    <div className="head">
      <div className="main-menu">
        <button className="main-menu-button" onClick={toggleDropdown}>
          &#9776;
        </button>
        <marquee>SARAT TECH Online Retail Store is a modern and user-friendly online shopping platform designed to bring convenience, quality, and savings right to your fingertips. Whether you're shopping for the latest electronics, stylish clothing, home essentials, groceries, or personal care items, Sarat Tech offers a wide range of products with fast delivery and unmatched service.</marquee>
        <div className="menu-links">
          <Link to="/" className="menu-link">Home</Link>
          <Link to="/about" className="menu-link">About</Link>
          <Link to="/contact" className="menu-link">Contact</Link>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <ul>
            {categories.map((category, index) => (
              <li key={index} onClick={() => navigateToCategory(category)}>
                {category}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MainMenu;
