import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "./PopUp";
import Carousal from "../Carousal/carousal";
import "./PopUp.css";
import "./Home.css";

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [categories, setCategories] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8086/categories/all");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();

        console.log("Fetched categories:", data);  // Debug log

        // If API returns { categories: [...] } adjust here:
        // setCategories(data.categories || []);

        // If API returns array directly:
        setCategories(data);
        setStatusMessage("");
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
        setStatusMessage("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  const navigateToCategory = (categoryName) => {
    if (categoryName) {
      navigate(`/category/${categoryName}`);
    }
  };

  const buildImageUrl = (path) => {
    if (!path) return "/placeholder-category.png"; // fallback image
    return `http://localhost:8086/images${path.startsWith("/") ? "" : "/"}${path}`;
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <Carousal />
      </header>

      {showPopup && (
        <Popup
          message="Choose Featured Categories To Shop Now"
          onClose={() => setShowPopup(false)}
        />
      )}

      <section className="home-features">
        <h2 className="featured1">Featured Categories</h2>

        <div className="categories">
          {categories === null && <p>Loading categories...</p>}

          {statusMessage && <p className="error-message">{statusMessage}</p>}

          {categories && categories.length === 0 && !statusMessage && (
            <p>No categories found.</p>
          )}

          {categories && categories.length > 0 && (
            categories.map((category) => (
              <div
                key={category.id || category._id || Math.random()}
                className="category-card"
                onClick={() => navigateToCategory(category.categoryName)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter") navigateToCategory(category.categoryName);
                }}
              >
                <img
                  src={buildImageUrl(category.imagePath)}
                  alt={category.categoryName}
                  className="category-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-category.png"; // fallback on error
                  }}
                />
                <h3>{category.categoryName}</h3>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
