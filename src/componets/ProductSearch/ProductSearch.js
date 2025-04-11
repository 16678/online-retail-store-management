// ProductSearch.js
import React from "react";

const ProductSearch = ({ category, setCategory, onSearch, loading }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Search Products by Category</h2>
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Enter category"
      />
      <button onClick={onSearch} disabled={loading}>
        {loading ? "Loading..." : "Search"}
      </button>
    </div>
  );
};

export default ProductSearch;
