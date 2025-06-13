import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <a href="#top" className="back-to-top">Back to top</a>
      </div>

      <div className="footer-links-container">
        {/* Useful Links */}
        <div className="footer-column multi-column">
          <h4>Useful Links</h4>
          <ul>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#privacy">Privacy</a></li>
            <li><a href="#terms">Terms</a></li>
            <li><a href="#faqs">FAQs</a></li>
            <li><a href="#security">Security</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#partner">Partner</a></li>
            <li><a href="#franchise">Franchise</a></li>
            <li><a href="#seller">Seller</a></li>
            <li><a href="#warehouse">Warehouse</a></li>
            <li><a href="#deliver">Deliver</a></li>
          </ul>
        </div>

       

        {/* Categories */}
        <div className="footer-column multi-column categories-column">
          <h4>Categories</h4>
          <ul>
            <li><a href="#see-all">see all</a></li>
            <li><a href="#vegetables-fruits">Vegetables & Fruits</a></li>
            <li><a href="#dairy-breakfast">Dairy & Breakfast</a></li>
            <li><a href="#munchies">Munchies</a></li>
            <li><a href="#cold-drinks">Cold Drinks & Juices</a></li>
            <li><a href="#instant-frozen">Instant & Frozen Food</a></li>
            <li><a href="#tea-coffee">Tea, Coffee & Health Drinks</a></li>
            <li><a href="#bakery-biscuits">Bakery & Biscuits</a></li>
            <li><a href="#sweet-tooth">Sweet Tooth</a></li>
            <li><a href="#atta-rice-dal">Atta, Rice & Dal</a></li>
            <li><a href="#dry-fruits-masala">Dry Fruits, Masala & Oil</a></li>
            <li><a href="#sauces-spreads">Sauces & Spreads</a></li>
            <li><a href="#chicken-meat-fish">Chicken, Meat & Fish</a></li>
            <li><a href="#organic-premium">Organic & Premium</a></li>
            <li><a href="#paan-corner">Paan Corner</a></li>
            <li><a href="#baby-care">Baby Care</a></li>
            <li><a href="#pharma-wellness">Pharma & Wellness</a></li>
            <li><a href="#cleaning-essentials">Cleaning Essentials</a></li>
            <li><a href="#home-office">Home & Office</a></li>
            <li><a href="#ice-creams">Ice Creams & Frozen Desserts</a></li>
            <li><a href="#personal-care">Personal Care</a></li>
            <li><a href="#pet-care">Pet Care</a></li>
            <li><a href="#beauty-cosmetics">Beauty & Cosmetics</a></li>
            <li><a href="#magazines">Magazines</a></li>
            <li><a href="#electronics">Electronics & Electricals</a></li>
            <li><a href="#books">Books</a></li>
            <li><a href="#toys-games">Toys & Games</a></li>
            <li><a href="#print-store">Print Store</a></li>
            <li><a href="#egift-cards">E-Gift Cards</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-app-download">
        <h4>Download App</h4>
        <div className="app-buttons">
          <a href="#appstore" className="app-store-btn">App Store</a>
          <a href="#playstore" className="play-store-btn">Play Store</a>
        </div>
      </div>

      <div className="footer-bottom-text">
        <p>© Blink Commerce Private Limited, 2016-2025</p>
        <p className="disclaimer">
          “Blinkit” is owned & managed by "Blink Commerce Private Limited" and is not related, linked or interconnected in whatsoever manner or nature, to “GROFFR.COM” which is a real estate services business operated by “Redstone Consultancy Services Private Limited”.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
