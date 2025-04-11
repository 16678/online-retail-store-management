import React from "react";
import { Link } from 'react-router-dom';
import './signPopUp.css';

const SignupPopup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
       <Link to="SignUp"><h2>Sign Up</h2></Link><br></br>
        <p>OR</p>
       <Link to="Login"><h3> Log In</h3></Link> 
        <p>Please sign up or log in to access your profile!</p>
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default SignupPopup;
