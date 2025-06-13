import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminCartManager.css";

const CartDetailsAdmin = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart items from backend
  const fetchCartItems = async () => {
    try {
      const response = await axios.get("http://localhost:8086/api/cart/all");
      setCartItems(response.data);
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setError("Failed to fetch cart items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Delete cart item and reload cart from backend
  const handleDelete = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:8086/api/cart/delete/${cartItemId}`);

      // Reload cart items from backend after delete to reflect fresh data
      await fetchCartItems();
    } catch (err) {
      console.error("Error deleting cart item:", err);
      alert("Failed to delete cart item.");
    }
  };

  if (loading) return <p>Loading cart details...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Cart Items for All Customers</h2>

      {cartItems.length === 0 ? (
        <p>No cart items found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="border px-4 py-2">Cart Item ID</th>
                <th className="border px-4 py-2">Customer ID</th>
                <th className="border px-4 py-2">Customer Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Product Name</th>
                <th className="border px-4 py-2">Brand</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Discount</th>
                <th className="border px-4 py-2">Image</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(({ id, customer, product, quantity }) => (
                <tr key={id} className="text-center text-sm">
                  <td className="border px-4 py-2">{id}</td>
                  <td className="border px-4 py-2">{customer?.customerId || "N/A"}</td>
                  <td className="border px-4 py-2">{customer?.customerName || "N/A"}</td>
                  <td className="border px-4 py-2">{customer?.email || "N/A"}</td>
                  <td className="border px-4 py-2">{product?.productName || "N/A"}</td>
                  <td className="border px-4 py-2">{product?.brand || "N/A"}</td>
                  <td className="border px-4 py-2">{quantity}</td>
                  <td className="border px-4 py-2">₹{product?.price?.toFixed(2) || "0.00"}</td>
                  <td className="border px-4 py-2">{product?.discountPercentage || 0}%</td>
                  <td className="border px-4 py-2">
                    {product?.imagePath1 ? (
                      <img
                        src={`http://localhost:8086/images/${product.imagePath1}`}
                        alt={product.productName}
                        className="w-16 h-16 object-cover mx-auto"
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDelete(id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CartDetailsAdmin;
