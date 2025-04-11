import React, { useState } from "react";
import axios from "axios";
import "./AddProducts.css"; // For styling

const AddProduct = () => {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    thumbnailPath: "",
    price: "",
    inStock: true,
    noOfReviews: 0,
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8080/api/products/add", product)
      .then((response) => {
        alert("Product added successfully!");
        setProduct({
          title: "",
          description: "",
          thumbnailPath: "",
          price: "",
          inStock: true,
          noOfReviews: 0,
          category: "",
        });
      })
      .catch((error) => {
        alert("Error adding product: " + error.message);
      });
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <h1>Add Product</h1>
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
      <select
        name="inStock"
        value={product.inStock}
        onChange={(e) =>
          setProduct((prev) => ({
            ...prev,
            inStock: e.target.value === "true",
          }))
        }
      >
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
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProduct;
