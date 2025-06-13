import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import "./ViewProducts.css";

const API_BASE_URL = "http://localhost:8086/api/products";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [discountInputId, setDiscountInputId] = useState(null);
  const [discountValue, setDiscountValue] = useState("");

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();

    // Cleanup previews on unmount or when images change
    return () => {
      selectedImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, []);

  // Auto-clear error and success messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Fetch products list
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(API_BASE_URL);
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setError("Unexpected product data received.");
        setProducts([]);
      }
    } catch {
      setError("Failed to fetch products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Begin editing a product
  const startEditing = (product) => {
    setEditingProduct({ ...product });
    setSelectedImages([]);
    clearMessages();
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingProduct(null);
    setSelectedImages([]);
    clearMessages();
  };

  // Handle input changes while editing
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({ ...prev, [name]: value }));
  };

  // Handle image file selection, max 5 images
  const handleImageSelection = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 5) {
      alert("Maximum 5 images allowed.");
      return;
    }
    const filesWithPreview = files.map(file => {
      file.preview = URL.createObjectURL(file);
      return file;
    });
    setSelectedImages(prev => [...prev, ...filesWithPreview]);
  };

  // Remove a selected image preview
  const removeSelectedImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Basic product validation
  const validateProduct = (product) => {
    if (!product.productName?.trim()) return "Product name is required.";
    if (!product.brand?.trim()) return "Brand is required.";
    if (product.stock < 0) return "Stock cannot be negative.";
    if (product.price <= 0) return "Price must be greater than zero.";
    if (product.discountedPrice < 0) return "Discounted price cannot be negative.";
    if (product.discountPercentage < 0) return "Discount percentage cannot be negative.";
    return null;
  };

  // Save updated product
  const saveProduct = async () => {
    if (!editingProduct) return;

    const validationError = validateProduct(editingProduct);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    clearMessages();

    const formData = new FormData();
    [
      "productName",
      "brand",
      "price",
      "discountedPrice",
      "discountPercentage",
      "stock",
      "topCategory",
      "secondCategory",
      "thirdCategory",
      "sizeName",
    ].forEach(field => {
      formData.append(field, editingProduct[field] ?? "");
    });

    selectedImages.forEach(img => formData.append("files", img));

    try {
      await axios.put(`${API_BASE_URL}/update/${editingProduct.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Product updated successfully.");
      cancelEditing();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setLoading(true);
    clearMessages();

    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setSuccess("Product deleted successfully.");
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle discount input visibility
  const toggleDiscountInput = (id) => {
    if (discountInputId === id) {
      setDiscountInputId(null);
      setDiscountValue("");
    } else {
      clearMessages();
      setDiscountInputId(id);
      setDiscountValue("");
    }
  };

  // Apply discount percentage to product
  const applyDiscount = async (id) => {
    const discount = Number(discountValue);
    if (isNaN(discount) || discount <= 0 || discount > 100) {
      setError("Discount must be a number between 1 and 100.");
      return;
    }

    if (!window.confirm(`Apply ${discount}% discount to product ID ${id}?`)) return;

    setLoading(true);
    clearMessages();

    try {
      await axios.put(`${API_BASE_URL}/update/${id}`, null, {
        params: { discountPercentage: discount },
      });
      setSuccess("Discount applied successfully.");
      setDiscountInputId(null);
      setDiscountValue("");
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply discount.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare products with their images grouped for display
  const productsWithImages = useMemo(() => 
    products.map(product => ({
      ...product,
      images: [
        product.imagePath1,
        product.imagePath2,
        product.imagePath3,
        product.imagePath4,
        product.imagePath5,
      ].filter(Boolean),
    })),
    [products]
  );

  return (
    <div className="view-products-container">
      <h2>Product List</h2>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Images</th>
            <th>Product Name</th>
            <th>Brand</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Price</th>
            <th>Discount (%)</th>
            <th>Discounted Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productsWithImages.length === 0 ? (
            <tr>
              <td colSpan={10} style={{ textAlign: "center" }}>
                No products found.
              </td>
            </tr>
          ) : (
            productsWithImages.map(product => {
              const isEditing = editingProduct?.id === product.id;

              return (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td className="product-images-cell">
                    {product.images.length > 0 ? (
                      product.images.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Product ${product.id} image ${idx + 1}`}
                          className="product-image"
                        />
                      ))
                    ) : (
                      <span>No image</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        aria-label="Product Name"
                        name="productName"
                        value={editingProduct.productName}
                        onChange={handleEditInputChange}
                      />
                    ) : (
                      product.productName
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        aria-label="Brand"
                        name="brand"
                        value={editingProduct.brand}
                        onChange={handleEditInputChange}
                      />
                    ) : (
                      product.brand
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        aria-label="Stock"
                        type="number"
                        name="stock"
                        value={editingProduct.stock}
                        onChange={handleEditInputChange}
                      />
                    ) : (
                      product.stock
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="category-inputs">
                        <label>
                          Top Category
                          <input
                            name="topCategory"
                            value={editingProduct.topCategory || ""}
                            onChange={handleEditInputChange}
                          />
                        </label>
                        <label>
                          Second Category
                          <input
                            name="secondCategory"
                            value={editingProduct.secondCategory || ""}
                            onChange={handleEditInputChange}
                          />
                        </label>
                        <label>
                          Third Category
                          <input
                            name="thirdCategory"
                            value={editingProduct.thirdCategory || ""}
                            onChange={handleEditInputChange}
                          />
                        </label>
                      </div>
                    ) : (
                      `${product.topCategory} / ${product.secondCategory} / ${product.thirdCategory}`
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        aria-label="Price"
                        type="number"
                        name="price"
                        value={editingProduct.price}
                        onChange={handleEditInputChange}
                      />
                    ) : (
                      product.price
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        aria-label="Discount Percentage"
                        type="number"
                        name="discountPercentage"
                        value={editingProduct.discountPercentage}
                        onChange={handleEditInputChange}
                      />
                    ) : (
                      product.discountPercentage
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        aria-label="Discounted Price"
                        type="number"
                        name="discountedPrice"
                        value={editingProduct.discountedPrice}
                        onChange={handleEditInputChange}
                      />
                    ) : (
                      product.discountedPrice
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <>
                        <button onClick={saveProduct} disabled={loading}>
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button onClick={cancelEditing} disabled={loading}>
                          Cancel
                        </button>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageSelection}
                          disabled={selectedImages.length >= 5}
                          aria-label="Select Images"
                        />
                        <div className="selected-images-preview">
                          {selectedImages.map((img, idx) => (
                            <div key={idx} className="selected-image-wrapper">
                              <img src={img.preview} alt={`Selected ${idx + 1}`} />
                              <button onClick={() => removeSelectedImage(idx)}>Remove</button>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditing(product)} disabled={loading}>
                          Edit
                        </button>
                        <button onClick={() => deleteProduct(product.id)} disabled={loading}>
                          Delete
                        </button>
                        <button onClick={() => toggleDiscountInput(product.id)}>
                          {discountInputId === product.id ? "Cancel Discount" : "Apply Discount"}
                        </button>
                        {discountInputId === product.id && (
                          <div className="discount-input-section">
                            <input
                              type="number"
                              min="1"
                              max="100"
                              placeholder="Discount %"
                              value={discountValue}
                              onChange={(e) => setDiscountValue(e.target.value)}
                              aria-label="Discount Percentage"
                            />
                            <button onClick={() => applyDiscount(product.id)} disabled={loading}>
                              {loading ? "Applying..." : "Apply"}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewProducts;
