import React, { useEffect, useState } from "react";
import { fetchProducts, addProduct, deleteProduct } from "./api";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: 0, stockQuantity: 0 });

  useEffect(() => {
    fetchProducts().then((res) => setProducts(res.data));
  }, []);

  const handleAddProduct = () => {
    addProduct(newProduct).then(() => fetchProducts().then((res) => setProducts(res.data)));
  };

  const handleDeleteProduct = (id) => {
    deleteProduct(id).then(() => fetchProducts().then((res) => setProducts(res.data)));
  };

  return (
    <div>
      <h2>Product Management</h2>
      <input
        placeholder="Name"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
      />
      <input
        placeholder="Price"
        value={newProduct.price}
        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
      />
      <input
        placeholder="Stock"
        value={newProduct.stockQuantity}
        onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
      />
      <button onClick={handleAddProduct}>Add Product</button>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.price} - {product.stockQuantity}
            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductManagement;
