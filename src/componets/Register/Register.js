import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register({ onRegister = () => {} }) {
  const [customername, setCustomername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const navigate = useNavigate();

  async function save(event) {
    event.preventDefault();

    const customerData = {
      customername,
      email,
      password,
      confirmPassword,
      phoneNumber,
    };

    try {
      const response = await axios.post("http://localhost:8086/api/v1/customer/save", customerData, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Customer Registration Successful");

      // Store customer data in localStorage
      localStorage.setItem("customer", JSON.stringify(response.data));

      onRegister(response.data);
      navigate("/"); // Redirect to profile page
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data || err.message || "An unexpected error occurred.";
      alert(`Registration failed: ${errorMessage}`);
    }
  }

  return (
    <div>
      <h1 className="Register">Register</h1>
      <div className="container mt-4">
        <div className="card">
          <form>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" className="form-control" placeholder="Enter Name" value={customername} onChange={(e) => setCustomername(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" className="form-control" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" className="form-control" placeholder="Enter Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary mt-4" onClick={save}>
              Register
            </button>
          </form>
          <p className="mt-3 text-center">
            Already have an account? <Link to="/login">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
