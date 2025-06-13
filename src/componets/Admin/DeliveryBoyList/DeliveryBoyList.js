import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DeliveryBoyList.css';

const DeliveryBoyList = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [previewImage, setPreviewImage] = useState(null); // Image preview state

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const fetchDeliveryBoys = async () => {
    try {
      const response = await axios.get('http://localhost:8086/api/deliveryboys');
      setDeliveryBoys(response.data);
    } catch (error) {
      console.error('Error fetching delivery boys:', error);
    }
  };

  const fetchDeliveryBoyById = async (id) => {
    if (!id) return;
    try {
      const response = await axios.get(`http://localhost:8086/api/deliveryboys/${id}`);
      setDeliveryBoys([response.data]);
    } catch (error) {
      console.error('Error fetching delivery boy by ID:', error);
      setDeliveryBoys([]);
    }
  };

  const deleteDeliveryBoy = async (id) => {
    if (!window.confirm('Are you sure you want to delete this delivery boy?')) return;
    try {
      await axios.delete(`http://localhost:8086/api/deliveryboys/${id}`);
      fetchDeliveryBoys();
    } catch (error) {
      console.error('Error deleting delivery boy:', error);
      alert('Failed to delete delivery boy.');
    }
  };

  const formatImagePath = (path) => {
    return path ? `http://localhost:8086/${path.replace(/\\/g, '/')}` : '';
  };

  const handleImageClick = (src) => {
    setPreviewImage(src);
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Delivery Boy Full Details</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="number"
          placeholder="Enter Delivery Boy ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={() => fetchDeliveryBoyById(searchId)}>Search by ID</button>
        <button onClick={fetchDeliveryBoys} style={{ marginLeft: '10px' }}>Show All</button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Emergency Contact</th>
              <th>Vehicle</th>
              <th>Driving License No</th>
              <th>Availability</th>
              <th>Working Hours</th>
              <th>Experience</th>
              <th>Bank Details</th>
              <th>Referral Code</th>
              <th>Consent</th>
              <th>Profile Pic</th>
              <th>Insurance</th>
              <th>RC Book</th>
              <th>Driving License Upload</th>
              <th>Police Verification</th>
              <th>Vehicle Plates</th>
              <th>ID Proofs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryBoys.length > 0 ? (
              deliveryBoys.map((boy) => (
                <tr key={boy.id}>
                  <td>{boy.id}</td>
                  <td>{boy.firstName} {boy.lastName}</td>
                  <td>{boy.dob}</td>
                  <td>{boy.gender}</td>
                  <td>{boy.email}</td>
                  <td>{boy.phone}</td>
                  <td>{boy.street}, {boy.city}, {boy.state} - {boy.pincode}</td>
                  <td>{boy.emergencyName} ({boy.emergencyRelationship}) - {boy.emergencyPhone}</td>
                  <td>{boy.vehicleType} - {boy.vehicleNumber}</td>
                  <td>{boy.drivingLicenseNumber}</td>
                  <td>{boy.availability}</td>
                  <td>{boy.workingHours}</td>
                  <td>{boy.experience} yrs</td>
                  <td>
                    {boy.bankHolder}<br />
                    {boy.bankName}<br />
                    A/C: {boy.accountNumber}<br />
                    IFSC: {boy.ifscCode}
                  </td>
                  <td>{boy.referralCode}</td>
                  <td>
                    Terms: {boy.termsAccepted ? 'Yes' : 'No'}<br />
                    Consent: {boy.digitalConsent ? 'Yes' : 'No'}
                  </td>
                  <td>
                    <img
                      src={formatImagePath(boy.profilePicPath)}
                      alt="Profile"
                      className="doc-img"
                      onClick={() => handleImageClick(formatImagePath(boy.profilePicPath))}
                    />
                  </td>
                  <td>
                    <img
                      src={formatImagePath(boy.insuranceCertificatePath)}
                      alt="Insurance"
                      className="doc-img"
                      onClick={() => handleImageClick(formatImagePath(boy.insuranceCertificatePath))}
                    />
                  </td>
                  <td>
                    <img
                      src={formatImagePath(boy.rcBookPath)}
                      alt="RC Book"
                      className="doc-img"
                      onClick={() => handleImageClick(formatImagePath(boy.rcBookPath))}
                    />
                  </td>
                  <td>
                    <img
                      src={formatImagePath(boy.drivingLicenseUploadPath)}
                      alt="DL Upload"
                      className="doc-img"
                      onClick={() => handleImageClick(formatImagePath(boy.drivingLicenseUploadPath))}
                    />
                  </td>
                  <td>
                    <img
                      src={formatImagePath(boy.policeVerificationPath)}
                      alt="Police Verification"
                      className="doc-img"
                      onClick={() => handleImageClick(formatImagePath(boy.policeVerificationPath))}
                    />
                  </td>
                  <td>
                    {boy.vehicleNumberPlatePaths && boy.vehicleNumberPlatePaths.map((path, idx) => (
                      <img
                        key={idx}
                        src={formatImagePath(path)}
                        alt={`Plate ${idx + 1}`}
                        className="doc-img"
                        onClick={() => handleImageClick(formatImagePath(path))}
                      />
                    ))}
                  </td>
                  <td>
                    {boy.idProofPaths && boy.idProofPaths.map((path, idx) => (
                      <img
                        key={idx}
                        src={formatImagePath(path)}
                        alt={`ID Proof ${idx + 1}`}
                        className="doc-img"
                        onClick={() => handleImageClick(formatImagePath(path))}
                      />
                    ))}
                  </td>
                  <td>
                    <button className="btn edit-btn">Edit</button>
                    <button className="btn delete-btn" onClick={() => deleteDeliveryBoy(boy.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="24" className="no-data">No delivery boys found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="image-preview-overlay" onClick={() => setPreviewImage(null)}>
          <div className="image-preview-content" onClick={(e) => e.stopPropagation()}>
            <img src={previewImage} alt="Preview" />
            <button className="close-btn" onClick={() => setPreviewImage(null)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryBoyList;
