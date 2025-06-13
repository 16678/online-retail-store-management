// import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
import axios from 'axios';

function DeliveryBoy() {
  const [scannedUserId, setScannedUserId] = useState('');
  const [queue, setQueue] = useState([]);

  const handleScan = async (data) => {
    if (data) {
      setScannedUserId(data);
      try {
        const res = await axios.post('http://localhost:8080/api/queue/scan', null, {
          params: { userId: data }
        });
        alert(res.data);
        fetchQueue();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const fetchQueue = async () => {
    const res = await axios.get('http://localhost:8080/api/queue/queue');
    setQueue(res.data);
  };

  const assignNext = async () => {
    const deliveryBoyId = "deliveryBoy123"; // Replace with actual logged-in ID
    const res = await axios.post('http://localhost:8080/api/queue/assign', null, {
      params: { deliveryBoyId }
    });
    alert(res.data);
    fetchQueue();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Scan QR to Join Queue</h2>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '300px' }}
      />
      <p>Last scanned: {scannedUserId}</p>

      <h3>Queue</h3>
      <ul>
        {queue.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>

      <button onClick={assignNext}>Assign Next Delivery</button>
    </div>
  );
}

export default DeliveryBoy;
