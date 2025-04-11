import React from "react";
import "./PopUp.css";

const Popup = ({ message, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h3>Notification</h3>
          <button className="popup-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="popup-body">
          <p>{message}</p>
        </div>
        <div className="popup-footer">
          <button className="popup-action" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
