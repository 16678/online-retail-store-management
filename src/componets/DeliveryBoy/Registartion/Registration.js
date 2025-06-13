import React, { useState } from "react";
import './Registration.css';

const DeliveryBoyRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", dob: "", gender: "",
    phone: "", email: "", password: "", confirmPassword: "",
    street: "", city: "", state: "", pincode: "",
    emergencyName: "", emergencyRelationship: "", emergencyPhone: "",
    vehicleType: "", vehicleNumber: "", drivingLicenseNumber: "",
    availability: "Active", workingHours: "",
    bankHolder: "", bankName: "", accountNumber: "", ifscCode: "",
    referralCode: "", experience: "",
    termsAccepted: false, digitalConsent: false,
  });

  const [files, setFiles] = useState({
    idProofPaths: [], // 2 files
    vehicleNumberPlates: [], // 2 files
    profilePic: null,
    insuranceCertificate: null,
    rcBook: null,
    drivingLicenseUpload: null,
    policeVerification: null,
  });

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSingleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setFiles(prev => {
      if (field === "idProofPaths" || field === "vehicleNumberPlates") {
        if (prev[field].length >= 2) {
          alert(`Only 2 files allowed for ${field}`);
          return prev;
        }
        return { ...prev, [field]: [...prev[field], file] };
      }
      return { ...prev, [field]: file };
    });

    e.target.value = null;
  };

  const removeFile = (field, index) => {
    setFiles(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!formData.termsAccepted || !formData.digitalConsent) {
      alert("Please accept terms and consent.");
      return;
    }

    if (files.idProofPaths.length !== 2 || files.vehicleNumberPlates.length !== 2) {
      alert("Upload exactly 2 ID proof and 2 vehicle number plate images.");
      return;
    }

    const submissionData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "confirmPassword") {
        submissionData.append(key, value);
      }
    });

    files.idProofPaths.forEach(file => submissionData.append("idProofPaths", file));
    files.vehicleNumberPlates.forEach(file => submissionData.append("vehicleNumberPlates", file));

    ["profilePic", "insuranceCertificate", "rcBook", "drivingLicenseUpload", "policeVerification"].forEach(key => {
      if (files[key]) submissionData.append(key, files[key]);
    });

    try {
      const response = await fetch("http://localhost:8086/api/deliveryboys", {
        method: "POST",
        body: submissionData,
      });

      if (!response.ok) throw new Error("Failed to register");

      alert("Registration successful!");
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    }
  };

  const renderInput = (label, name, type = "text", required = true) => (
    <div className="form-group" key={name}>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required={required}
      />
    </div>
  );

  const renderFileInput = (label, name) => {
    const isMulti = name === "idProofPaths" || name === "vehicleNumberPlates";

    return (
      <div className="form-group" key={name}>
        <label>{label}</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => handleSingleFileChange(e, name)}
        />

        {isMulti && files[name].length > 0 && (
          <div className="preview-group">
            {files[name].map((file, idx) => (
              <div key={idx} className="preview-item">
                {file.type.startsWith("image/") ? (
                  <img src={URL.createObjectURL(file)} alt="preview" />
                ) : (
                  <p>{file.name}</p>
                )}
                <button type="button" onClick={() => removeFile(name, idx)}>&times;</button>
              </div>
            ))}
          </div>
        )}

        {!isMulti && files[name] && <p>Selected: {files[name].name}</p>}
      </div>
    );
  };

  return (
    <div className="registration-container">
      <h2>Delivery Boy Registration</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        {/* Personal Info */}
        {renderInput("First Name", "firstName")}
        {renderInput("Last Name", "lastName")}
        {renderInput("Date of Birth", "dob", "date")}
        {renderInput("Phone", "phone")}
        {renderInput("Email", "email", "email")}
        {renderInput("Password", "password", "password")}
        {renderInput("Confirm Password", "confirmPassword", "password")}

        {/* Gender */}
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Address */}
        {renderInput("Street", "street")}
        {renderInput("City", "city")}
        {renderInput("State", "state")}
        {renderInput("Pincode", "pincode")}

        {/* Emergency */}
        {renderInput("Emergency Contact Name", "emergencyName")}
        {renderInput("Relationship", "emergencyRelationship")}
        {renderInput("Contact Number", "emergencyPhone")}

        {/* Vehicle Info */}
        {renderInput("Vehicle Type", "vehicleType")}
        {renderInput("Vehicle Number", "vehicleNumber")}
        {renderInput("Driving License Number", "drivingLicenseNumber")}

        {/* File Uploads */}
        {renderFileInput("ID Proof (2 files max)", "idProofPaths")}
        {renderFileInput("Vehicle Number Plates (2 files max)", "vehicleNumberPlates")}
        {renderFileInput("Profile Picture", "profilePic")}
        {renderFileInput("Insurance Certificate", "insuranceCertificate")}
        {renderFileInput("RC Book", "rcBook")}
        {renderFileInput("Driving License Upload", "drivingLicenseUpload")}
        {renderFileInput("Police Verification", "policeVerification")}

        {/* Availability */}
        <div className="form-group">
          <label>Availability</label>
          <select name="availability" value={formData.availability} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        {renderInput("Working Hours", "workingHours", "text", false)}

        {/* Bank Details */}
        {renderInput("Bank Account Holder Name", "bankHolder")}
        {renderInput("Bank Name", "bankName")}
        {renderInput("Account Number", "accountNumber")}
        {renderInput("IFSC Code", "ifscCode")}

        {/* Extra */}
        {renderInput("Referral Code (optional)", "referralCode", "text", false)}
        {renderInput("Experience", "experience", "text", false)}

        {/* Checkboxes */}
        <div className="form-group">
          <label>
            <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} required />
            I accept the Terms and Conditions
          </label>
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox" name="digitalConsent" checked={formData.digitalConsent} onChange={handleChange} required />
            I give digital consent
          </label>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default DeliveryBoyRegistration;
