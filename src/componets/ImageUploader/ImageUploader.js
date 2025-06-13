import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ImageUploader.css'; // Importing the new CSS file

const ProductUploader = () => {
  const [productName, setProductName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [productList, setProductList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8086/products/all');
      setProductList(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setStatusMessage('Error fetching product list.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpload = async () => {
    if (!productName.trim() || !imageFile) {
      setStatusMessage('Please provide a product name and choose an image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('file', imageFile);

    try {
      setIsUploading(true);
      setStatusMessage('');
      await axios.post('http://localhost:8086/products', formData);
      setStatusMessage('Product uploaded successfully!');
      setProductName('');
      setImageFile(null);
      fetchProducts();
    } catch (error) {
      console.error('Upload failed:', error);
      setStatusMessage('Failed to upload product. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8086/products/${id}`);
      setStatusMessage('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Delete failed:', error);
      setStatusMessage('Failed to delete product.');
    }
  };

  return (
    <div className="product-uploader-container">
      <h2 className="section-title">Add New Product</h2>
      <div className="upload-form">
        <input
          type="text"
          className="product-input"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="file"
          className="file-input"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <button className="upload-button" onClick={handleUpload} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload Product'}
        </button>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </div>

      <h2 className="section-title">All Products</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productList.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>
                <img
                  src={`http://localhost:8086${product.imagePath}`}
                  alt={product.name}
                  className="product-image"
                />
              </td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(product.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductUploader;
