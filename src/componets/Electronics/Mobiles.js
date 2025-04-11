// src/components/ProductList.js
import React from 'react';
import './ProductList.css';
import Redmi from '../../assets/Mobiles/mobile1.webp';
import Vivo from '../../assets/Mobiles/Mobile2.webp';
import RealMe from '../../assets/Mobiles/Realme.jpg';


const products = [
    { id: 1, name: "Vivo", price: "₹15000", image:Vivo },
    { id: 2, name: "Redmi", price: "₹20000", image:Redmi  },
    { id: 3, name: "RealMe", price: "₹18000", image:RealMe },
    // Add more products as needed
];

const ProductList = () => {
    return (
        <div className="product-list">
            {products.map((product) => (
                <div key={product.id} className="product-card">
                    <img src={product.image} alt={product.name} />
                    <h2>{product.name}</h2>
                    <p>{product.price}</p>
                    <button>Add to Cart</button>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
