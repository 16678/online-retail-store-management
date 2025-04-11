import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewProducts.css";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDiscountInput, setShowDiscountInput] = useState(null);
  const [discountInputs, setDiscountInputs] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get("http://localhost:8086/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  const handleSaveClick = () => {
    axios
      .put(`http://localhost:8086/api/products/edit/${editingProduct.id}`, editingProduct)
      .then(() => {
        fetchProducts();
        setIsEditing(false);
      })
      .catch((error) => console.error("Error updating product:", error));
  };

  const handleDeleteClick = (id) => {
    axios
      .delete(`http://localhost:8086/api/products/delete/${id}`)
      .then(fetchProducts)
      .catch((error) => console.error("Error deleting product:", error));
  };

  const handleDiscountToggle = (id) => {
    setShowDiscountInput((prev) => (prev === id ? null : id));
  };

  const handleDiscountChange = (id, value) => {
    if (!value || isNaN(value) || value <= 0) return;

    setDiscountInputs((prev) => ({ ...prev, [id]: value }));

    axios
      .put(`http://localhost:8086/api/products/discount/${id}`, null, {
        params: { discountPercentage: value },
      })
      .then(() => fetchProducts())
      .catch((error) => console.error("Error applying discount:", error));
  };

  return (
    <div className="view-products-container">
      <h1> View Products</h1>
      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Original Price</th>
            <th>Discount (%)</th>
            <th>Discounted Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>
                <img src={product.imageUrl} alt={product.productName} className="product-image" />
              </td>
              <td>{product.productName}</td>
              <td>{product.stock}</td>
              <td>{product.topCategory}</td>
              <td>₹{product.price}</td>
              <td>{product.discountPercentage}%</td>
              <td>₹{product.discountedPrice}</td>
              <td>
                <button className="edit-button" onClick={() => handleEditClick(product)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDeleteClick(product.id)}>
                  Delete
                </button>
                <div className="discount-action">
                  <button className="discount-button" onClick={() => handleDiscountToggle(product.id)}>
                    Apply Discount
                  </button>
                  {showDiscountInput === product.id && (
                    <input
                      type="number"
                      placeholder="%"
                      className="inline-discount-input"
                      value={discountInputs[product.id] || ""}
                      onChange={(e) => handleDiscountChange(product.id, e.target.value)}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && (
        <div className="edit-modal">
          <div className="modal-content">
            <h3>Edit Product</h3>
            <form>
              <label>Product Name:</label>
              <input type="text" name="productName" value={editingProduct.productName || ""} onChange={handleInputChange} />
              <label>Stock:</label>
              <input type="number" name="stock" value={editingProduct.stock || ""} onChange={handleInputChange} />
              <label>Category:</label>
              <input type="text" name="topCategory" value={editingProduct.topCategory || ""} onChange={handleInputChange} />
              <label>Price:</label>
              <input type="number" name="price" value={editingProduct.price || ""} onChange={handleInputChange} />
              <label>Image URL:</label>
              <input type="text" name="imageUrl" value={editingProduct.imageUrl || ""} onChange={handleInputChange} />
              <button type="button" onClick={handleSaveClick}>Save</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProducts;
