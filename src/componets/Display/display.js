import React from "react";
import Home from "../Home/Home";
 // Ensure the CSS file is included for styling

const Display = ({ products }) => {
  return (
    <div className="product-list">
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id} className="product-item">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="product-image"
              />
              <div className="product-details">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p>
                  <strong>Category:</strong> {product.category} |{" "}
                  <strong>Sub-Category:</strong> {product.subCategory}
                </p>
                <p>
                  <strong>Price:</strong> ${product.price.toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default Display;
