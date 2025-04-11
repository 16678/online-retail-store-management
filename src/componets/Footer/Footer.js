// src/components/Footer.js
import React from 'react';
import './Footer.css'; // Import the CSS file for styling

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <a href="#top" className="back-to-top">Back to top</a>
            </div>
            <div className="footer-links">
                <div className="footer-column">
                    <h4>Get to Know Us</h4>
                    <ul>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#careers">Careers</a></li>
                      
                       
                      
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Connect with Us</h4>
                    <ul>
                        <li><a href="#facebook">Facebook</a></li>
                        <li><a href="#twitter">Twitter</a></li>
                        <li><a href="#instagram">Instagram</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Make Money with Us</h4>
                    <ul>
                        <li><a href="#sell">Sell on Retail Store</a></li>
                       
                        <li><a href="#business">Reatil Business</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Let Us Help You</h4>
                    <ul>
                        <li><a href="#account">Your Account</a></li>
                        
                        <li><a href="#shipping">Shipping Rates</a></li>
                        <li><a href="#help">Help</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2024, Your Company, Inc. or its affiliates</p>
            </div>
        </footer>
    );
};

export default Footer;
