// src/hooks/useCustomerAddress.js
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8086/api/v1/customer";

export default function useCustomerAddress(customer) {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");

  // Load initial addresses from the customer object
  useEffect(() => {
    if (customer?.address) {
      const addressList = Array.isArray(customer.address)
        ? customer.address
        : [customer.address];

      setAddresses(
        addressList.map((location, index) => ({
          id: Date.now() + index,
          location,
          isEditing: false,
          updatedLocation: "",
        }))
      );
    }
  }, [customer]);

  // Add a new address
  const handleAddAddress = async () => {
    const trimmed = newAddress.trim();
    if (!trimmed) return alert("Address cannot be empty");

    try {
      const res = await axios.put(
        `${API_BASE_URL}/update-address/${customer.customerId}`,
        trimmed,
        { headers: { "Content-Type": "text/plain" } }
      );

      localStorage.setItem("customer", JSON.stringify(res.data));

      setAddresses((prev) => [
        ...prev,
        {
          id: Date.now(),
          location: trimmed,
          isEditing: false,
          updatedLocation: "",
        },
      ]);

      setNewAddress("");
      alert("Address added successfully!");
    } catch (error) {
      console.error("Add Address Error:", error);
      alert("Failed to add address");
    }
  };

  // Enable edit mode for an address
  const handleEditAddress = (id) => {
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === id
          ? { ...addr, isEditing: true, updatedLocation: addr.location }
          : addr
      )
    );
  };

  // Save updated address to backend
  const handleSaveAddress = async (id) => {
    const addrToUpdate = addresses.find((addr) => addr.id === id);
    if (!addrToUpdate) return;

    const trimmed = addrToUpdate.updatedLocation.trim();
    if (!trimmed) return alert("Address cannot be empty");

    try {
      const res = await axios.put(
        `${API_BASE_URL}/update-address/${customer.customerId}`,
        trimmed,
        { headers: { "Content-Type": "text/plain" } }
      );

      localStorage.setItem("customer", JSON.stringify(res.data));

      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === id
            ? {
                ...addr,
                location: trimmed,
                isEditing: false,
                updatedLocation: "",
              }
            : addr
        )
      );

      alert("Address updated successfully!");
    } catch (error) {
      console.error("Update Address Error:", error);
      alert("Failed to update address");
    }
  };

  return {
    addresses,
    newAddress,
    setNewAddress,
    setAddresses, // Exposed for usage in other components like Cart
    handleAddAddress,
    handleEditAddress,
    handleSaveAddress,
  };
}
