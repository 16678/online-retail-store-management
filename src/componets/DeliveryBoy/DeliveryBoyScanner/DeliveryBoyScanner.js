import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

export default function DeliveryBoyScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDeliveryBoy = async (id) => {
    setLoading(true);
    setError(null);
    setScanResult(null);
    try {
      const response = await fetch(`http://localhost:8086/api/scan-delivery-boy/verify/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Delivery boy not found");
        } else {
          throw new Error("Failed to fetch delivery boy data");
        }
      }
      const data = await response.json();
      setScanResult(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleScan = (result) => {
    if (result?.text) {
      const scanned = result.text.trim();
      // If your IDs are numeric or alphanumeric, adjust regex accordingly
      if (/^\d+$/.test(scanned)) {
        fetchDeliveryBoy(scanned);
      } else {
        setError("Invalid QR content: expected numeric ID");
      }
    }
  };

  const handleError = (err) => {
    setError(err.message || "Error scanning QR code");
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Delivery Boy QR/Barcode Scanner</h2>

      <QrReader
        constraints={{ facingMode: "environment" }}
        onResult={(result, err) => {
          if (result) handleScan(result);
          if (err) handleError(err);
        }}
        style={{ width: "100%" }}
      />

      {loading && <p>Loading delivery boy details...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {scanResult && (
        <div style={{ marginTop: 20, border: "1px solid #ccc", padding: 10 }}>
          <h3>Delivery Boy Details</h3>
          <p><strong>ID:</strong> {scanResult.id}</p>
          <p><strong>Name:</strong> {scanResult.firstName} {scanResult.lastName}</p>
          <p><strong>Phone:</strong> {scanResult.phone}</p>
          <p><strong>Email:</strong> {scanResult.email}</p>
        </div>
      )}
    </div>
  );
}
