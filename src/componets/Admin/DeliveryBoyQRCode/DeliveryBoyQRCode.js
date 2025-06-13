import React from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // ✅ use named import

function DeliveryBoyQRCode() {
  const qrValue = "https://your-backend.com/api/queue/scan?storeId=store-001";

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Scan QR Code to Join Delivery Queue</h2>
      <QRCodeCanvas value={qrValue} size={256} />
    </div>
  );
}

export default DeliveryBoyQRCode;
