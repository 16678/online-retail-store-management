import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "./PopUp";
import Carousal from "../Carousal/carousal";
// Import Popup component
import "./PopUp.css";
import "./Home.css";
import Electronics from "../../assets/electronics.jpg";
import Fashion from "../../assets/Fashion.jpeg";
import Furniture from "../../assets/Home.webp";
import Books from "../../assets/Books.webp";
import Vegetables from "../../assets/vegitables.webp";
import Dairy from "../../assets/Dairy.avif";
import ColdDrinks from "../../assets/colddrinks.webp";
import FrozenFood from "../../assets/froozenfood.webp";
import TeaCoffee from "../../assets/tea.webp";
import Bakery from "../../assets/bakery.webp";
import DryFruits from "../../assets/dryfruits.webp";
import PersonalCare from "../../assets/personalcare.webp";
import PetCare from "../../assets/petcare.webp";
import Beauty from "../../assets/beauty.avif";
import Accessories from "../../assets/Acessories.webp";
const Home = () => {
  const [showPopup, setShowPopup] = useState(false); // Popup state
  const navigate = useNavigate();

  const navigateToCategory = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <Carousal/>
        <h1>Welcome to Sarat Online Retail Store</h1>
        <p>Your one-stop shop for electronics, fashion, groceries, and more!</p>
        <div className="home-button-container">
          <button className="home-button" onClick={() => setShowPopup(true)}>
            Shop Now
          </button>

          <button className="home-button" onClick={() => navigate("/about")}>
            Learn More
          </button>
        </div>
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
          <div className="category-card" onClick={() => navigateToCategory("Electronics")}>
            <img src={Electronics} alt="Electronics" className="category-image" />
            <h3>Electronics</h3>
            <p>Discover the latest in electronics, from smartphones to gadgets.</p>
          </div>
          <div className="category-card" onClick={() => navigateToCategory("Cloths")}>
            <img src={Fashion} alt="Fashion" className="category-image" />
            <h3>Fashion</h3>
            <p>Browse trendy clothing, shoes, and accessories for all styles.</p>
          </div>
          <div className="category-card" onClick={() => navigateToCategory("Home & Furniture")}>
            <img src={Furniture} alt="Groceries" className="category-image" />
            <h3>Home & Furniture</h3>
            <p>Shop fresh groceries and daily essentials delivered to your door.</p>
          </div>

      <div className="category-card" onClick={() => navigateToCategory("Books")}>
        <img src={Books} alt="Books" className="category-image" />
        <h3>Books</h3>
        <p>Explore a wide range of books and enrich your knowledge.</p>
      </div>

      <div
        className="category-card"
        onClick={() => navigateToCategory("Vegetables & Fruits")}
      >
        <img src={Vegetables} alt="Vegetables & Fruits" className="category-image" />
        <h3>Vegetables & Fruits</h3>
        <p>Get fresh vegetables and fruits delivered to your home.</p>
      </div>

      <div
        className="category-card"
        onClick={() => navigateToCategory("Dairy & Breakfast")}
      >
        <img src={Dairy} alt="Dairy & Breakfast" className="category-image" />
        <h3>Dairy & Breakfast</h3>
        <p>Start your day with fresh dairy and wholesome breakfast options.</p>
      </div>

      <div
        className="category-card"
        onClick={() => navigateToCategory("Cold Drinks & Juices")}
      >
        <img src={ColdDrinks} alt="Cold Drinks & Juices" className="category-image" />
        <h3>Cold Drinks & Juices</h3>
        <p>Stay refreshed with a variety of cold drinks and juices.</p>
      </div>

      <div
        className="category-card"
        onClick={() => navigateToCategory("Instant Frozen Food")}
      >
        <img src={FrozenFood} alt="Instant Frozen Food" className="category-image" />
        <h3>Instant Frozen Food</h3>
        <p>Quick and tasty frozen food options for your busy days.</p>
      </div>

      <div
        className="category-card"
        onClick={() => navigateToCategory("Tea, Coffee & Beverages")}
      >
        <img src={TeaCoffee} alt="Tea, Coffee & Beverages" className="category-image" />
        <h3>Tea, Coffee & Beverages</h3>
        <p>Relax with a cup of tea or coffee and enjoy refreshing beverages.</p>
      </div>

      <div
        className="category-card"
        onClick={() => navigateToCategory("Bakery & Biscuits")}
      >
        <img src={Bakery} alt="Bakery & Biscuits" className="category-image" />
        <h3>Bakery & Biscuits</h3>
        <p>Indulge in freshly baked goods and delicious biscuits.</p>
      </div>

      <div
        className="category-card"
        onClick={() => navigateToCategory("Dry Fruits, Masala & Oil")}
      >
        <img src={DryFruits} alt="Dry Fruits, Masala & Oil" className="category-image" />
        <h3>Dry Fruits, Masala & Oil</h3>
        <p>Enhance your meals with premium dry fruits, spices, and oils.</p>
      </div>

      <div
        className="category-card"
        onClick={() => navigateToCategory("Personal Care")}
      >
        <img src={PersonalCare} alt="Personal Care" className="category-image" />
        <h3>Personal Care</h3>
        <p>Keep yourself healthy and well-groomed with personal care products.</p>
      </div>

      <div
        className="category-card"
        onClick={() => navigateToCategory("Pet Care")}
      >
        <img src={PetCare} alt="Pet Care" className="category-image" />
        <h3>Pet Care</h3>
        <p>Find everything you need to take care of your furry friends.</p>
      </div>

      <div
        className="category-card"
        onClick={() => navigateToCategory("Beauty & Cosmetics")}
      >
        <img src={Beauty} alt="Beauty & Cosmetics" className="category-image" />
        <h3>Beauty & Cosmetics</h3>
        <p>Enhance your beauty with premium cosmetics and skincare products.</p>
      </div>

      <div
        className="category-card"
        onClick={() => navigateToCategory("Accessories")}
      >
        <img src={Accessories} alt="Accessories" className="category-image" />
        <h3>Accessories</h3>
        <p>Complete your look with stylish and functional accessories.</p>
      </div>
    
        </div>
      </section>
    </div>
  );
};

export default Home;
