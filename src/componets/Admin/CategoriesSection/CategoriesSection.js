import React from 'react';
import './CategoriesSection.css';
import { FaTshirt, FaLaptop, FaMobileAlt, FaShoePrints, FaCouch, FaAppleAlt } from 'react-icons/fa';

const categories = [
  { name: 'Fashion', icon: <FaTshirt /> },
  { name: 'Electronics', icon: <FaLaptop /> },
  { name: 'Mobiles', icon: <FaMobileAlt /> },
  { name: 'Footwear', icon: <FaShoePrints /> },
  { name: 'Furniture', icon: <FaCouch /> },
  { name: 'Groceries', icon: <FaAppleAlt /> },
];

const CategoriesSection = () => {
  return (
    <div className="categories-container">
      <h2 className="categories-title">Shop by Category</h2>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div className="category-card" key={index}>
            <div className="category-icon">{category.icon}</div>
            <p>{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection;
