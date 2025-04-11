import React from 'react';
import './About.css'; // Optional: Import CSS for styling

const About = () => {
    return (
        <div className="about-container">
            <h1>About Us</h1>
            <p>
                Welcome to our Online Retail Store, your number one source for all things shopping. We're dedicated to giving you the very best of products, with a focus on dependability, customer service, and uniqueness.
            </p>
            <h2>Our Mission</h2>
            <p>
                Our mission is to provide our customers with high-quality products at competitive prices, making shopping convenient and enjoyable. We believe in the power of online shopping and aim to enhance your experience with our vast selection of products.
            </p>
            <h2>What We Offer</h2>
            <ul>
                <li>Wide range of products across various categories.</li>
                <li>Easy-to-navigate website for a seamless shopping experience.</li>
                <li>Secure payment options and customer privacy.</li>
                <li>Prompt customer support to assist you with your needs.</li>
            </ul>
            <h2>Our Values</h2>
            <p>
                We prioritize our customers' needs and strive for excellence in every aspect of our business. Trust, quality, and service are at the core of our values.
            </p>
            <h2>Get in Touch</h2>
            <p>
                If you have any questions or comments, feel free to <a href="/contact">contact us</a>. We would love to hear from you!
            </p>
        </div>
    );
};

export default About;
