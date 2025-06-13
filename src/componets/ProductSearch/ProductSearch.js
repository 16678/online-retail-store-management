// src/components/ProductSearch.js
import React, { useState } from 'react';
import axios from 'axios';
import './ProductSearch.css';

const ProductSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:8086/api/search/products', { keyword });
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div className="search-container">
      <h2>Search Products</h2>
      <div className="search-bar">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by name, brand, category..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="search-results">
        {results.length > 0 ? (
          results.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.productName}</h3>
              <p>Brand: {product.brand}</p>
              <p>Price: ₹{product.price}</p>
              <p>Discounted Price: ₹{product.discountedPrice}</p>
              <p>Stock: {product.stock}</p>
              <p>Size: {product.sizeName}</p>
              <p>Category: {product.topCategory} > {product.secondCategory} > {product.thirdCategory}</p>
              {product.images?.length > 0 && (
                <img src={`http://localhost:8086/${product.images[0]}`} alt="Product" />
              )}
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
