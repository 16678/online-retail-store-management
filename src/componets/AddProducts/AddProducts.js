import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddProducts.css";

const UpdateProduct = ({ productId }) => {
  const [product, setProduct] = useState({
    productName: "",
    brand: "",
    topCategory: "",
    secondCategory: "",
    thirdCategory: "",
    variants: [
      {
        size: "",
        price: "",
        discountedPrice: "",
        discountPercentage: "",
        stock: "",
        images: [],
      },
    ],
  });

  // Load product details by ID
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

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value, files } = e.target;
    const newVariants = [...product.variants];
    if (name === "images") {
      newVariants[index][name] = Array.from(files);
    } else {
      newVariants[index][name] = value;
    }
    setProduct((prev) => ({ ...prev, variants: newVariants }));
  };

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          size: "",
          price: "",
          discountedPrice: "",
          discountPercentage: "",
          stock: "",
          images: [],
        },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // OPTIONAL: handle image upload logic separately and replace images with URLs

    try {
      await axios.put(`http://localhost:8080/api/products/${productId}`, product);
      alert("Product updated successfully!");
    } catch (error) {
      alert("Error updating product: " + error.message);
    }
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <h1>Update Product</h1>

      <label>Product Name:</label>
      <input
        type="text"
        name="productName"
        value={product.productName}
        onChange={handleProductChange}
        required
      />

      <label>Brand:</label>
      <input
        type="text"
        name="brand"
        value={product.brand}
        onChange={handleProductChange}
        required
      />

      <label>Top Category:</label>
      <input
        type="text"
        name="topCategory"
        value={product.topCategory}
        onChange={handleProductChange}
        required
      />

      <label>Second Category:</label>
      <input
        type="text"
        name="secondCategory"
        value={product.secondCategory}
        onChange={handleProductChange}
      />

      <label>Third Category:</label>
      <input
        type="text"
        name="thirdCategory"
        value={product.thirdCategory}
        onChange={handleProductChange}
      />

      <hr />
      <h2>Variants</h2>

      {product.variants.map((variant, index) => (
        <div key={index} className="variant-block">
          <label>Size:</label>
          <input
            type="text"
            name="size"
            value={variant.size}
            onChange={(e) => handleVariantChange(index, e)}
            required
          />

          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={variant.price}
            onChange={(e) => handleVariantChange(index, e)}
            required
          />

          <label>Discounted Price:</label>
          <input
            type="number"
            name="discountedPrice"
            value={variant.discountedPrice}
            onChange={(e) => handleVariantChange(index, e)}
          />

          <label>Discount Percentage:</label>
          <input
            type="number"
            name="discountPercentage"
            value={variant.discountPercentage}
            onChange={(e) => handleVariantChange(index, e)}
          />

          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={variant.stock}
            onChange={(e) => handleVariantChange(index, e)}
            required
          />

          <label>Images:</label>
          <input
            type="file"
            name="images"
            multiple
            onChange={(e) => handleVariantChange(index, e)}
          />
        </div>
      ))}

      <button type="button" onClick={addVariant}>
        ➕ Add Variant
      </button>

      <button type="submit">Update Product</button>
    </form>
  );
};

export default UpdateProduct;
