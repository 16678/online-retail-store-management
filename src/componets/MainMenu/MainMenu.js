import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MainMenu.css";

const MainMenu = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8086/categories/all");
        setCategories(res.data || []);
        setError("");
      } catch (err) {
        console.error("Error loading categories:", err);
        setError("Failed to load categories.");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const buildImageUrl = (path) => {
    if (!path) return "/placeholder-category.png";
    return `http://localhost:8086/images${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="main-menu-container">
      {loading ? (
        <div className="loading-message">Loading categories...</div>
      ) : error ? (
        <div className="error-message text-red-500">{error}</div>
      ) : categories.length > 0 ? (
        <div className="category-bar">
          {categories.map((category) => (
            <div
              key={category.id || category._id || Math.random()}
              className="category-item cursor-pointer hover:bg-green-100 transition px-2 py-2 rounded-md text-center"
              onClick={() => handleCategoryClick(category.categoryName)}
            >
              <img
                src={buildImageUrl(category.imagePath)}
                alt={category.categoryName}
                className="category-icon"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-category.png";
                }}
              />
              <div className="category-label">{category.categoryName}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No categories available.</div>
      )}
    </div>
  );
};

export default MainMenu;
