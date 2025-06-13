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
  const [popup, setPopup] = useState({ message: "", type: "" });

  const navigate = useNavigate();

  const showPopup = (message, type = "success") => {
    setPopup({ message, type });
    setTimeout(() => setPopup({ message: "", type: "" }), 3000);
  };

  async function save(event) {
    event.preventDefault();
    const customerData = { customername, email, password, confirmPassword, phoneNumber };

    try {
      const response = await axios.post(
        "http://localhost:8086/api/v1/customer/save",
        customerData,
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("customer", JSON.stringify(response.data));
      onRegister(response.data);

      showPopup("Customer Registration Successful", "success");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data || err.message || "An unexpected error occurred.";
      showPopup(`Customer Registration Failed`, "error");
    }
  }

  return (
    <div>
      
      {popup.message && (
        <div className={`popup-message popup-${popup.type}`}>
          {popup.message}
        </div>
      )}

      <div className="container mt-4">
        <div className="card">
        <h1 className="Register">Register</h1>

          <form onSubmit={save}>
            <div className="form-group">
              <label>
                Full Name <span className="required-star">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                value={customername}
                onChange={(e) => setCustomername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Email <span className="required-star">*</span>
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Password <span className="required-star">*</span>
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <small className="password-hint text-muted">
                Password should contain letters, numbers & special characters
              </small>
            </div>

            <div className="form-group">
              <label>
                Confirm Password <span className="required-star">*</span>
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Phone Number <span className="required-star">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Phone Number"
                value={phoneNumber}
                maxLength="10"
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                  if (onlyNums.length <= 10) {
                    setPhoneNumber(onlyNums);
                  }
                }}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary mt-4">
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
