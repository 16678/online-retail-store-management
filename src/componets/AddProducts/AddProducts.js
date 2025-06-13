import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddProducts.css";

const UpdateProduct = ({ productId }) => {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    thumbnailPath: "",
    price: "",
    inStock: true,
    noOfReviews: 0,
    category: "",
  });

  // Load product details by ID when component mounts
  useEffect(() => {
    if (!productId) return;

    axios
      .get(`http://localhost:8080/api/products/${productId}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        alert("Failed to fetch product details: " + error.message);
      });
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For boolean select handling
    if (name === "inStock") {
      setProduct((prev) => ({
        ...prev,
        [name]: value === "true",
      }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:8080/api/products/${productId}`, product)
      .then((response) => {
        alert("Product updated successfully!");
      })
      .catch((error) => {
        alert("Error updating product: " + error.message);
      });
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <h1>Update Product</h1>
      <label>Title:</label>
      <input
        type="text"
        name="title"
        value={product.title}
        onChange={handleChange}
        required
      />
      <label>Description:</label>
      <textarea
        name="description"
        value={product.description}
        onChange={handleChange}
        required
      />
      <label>Thumbnail Path:</label>
      <input
        type="text"
        name="thumbnailPath"
        value={product.thumbnailPath}
        onChange={handleChange}
        required
      />
      <label>Price:</label>
      <input
        type="number"
        name="price"
        value={product.price}
        onChange={handleChange}
        required
      />
      <label>In Stock:</label>
      <select name="inStock" value={product.inStock} onChange={handleChange}>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
      <label>Category:</label>
      <input
        type="text"
        name="category"
        value={product.category}
        onChange={handleChange}
        required
      />
      <button type="submit">Update Product</button>
    </form>
  );
};

export default UpdateProduct;
