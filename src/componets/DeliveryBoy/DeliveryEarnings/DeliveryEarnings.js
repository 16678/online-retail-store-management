import React from "react";
import "./DeliveryEarnings.css";
import { FaRupeeSign } from "react-icons/fa";
import { BsCalendarDate } from "react-icons/bs";

const DeliveryEarnings = () => {
  const earningsData = {
    daily: 420,
    weekly: 2780,
    monthly: 11400,
    completedDeliveries: 56,
    tips: 350,
    paymentStatus: "Paid",
    lastPaymentDate: "12 June 2025",
  };

  return (
    <div className="earnings-container">
      <h2 className="earnings-header">Earnings Summary</h2>

      <div className="earnings-cards">
        <div className="earnings-card">
          <p>Today's Earnings</p>
          <h3><FaRupeeSign />{earningsData.daily}</h3>
        </div>
        <div className="earnings-card">
          <p>This Week</p>
          <h3><FaRupeeSign />{earningsData.weekly}</h3>
        </div>
        <div className="earnings-card">
          <p>This Month</p>
          <h3><FaRupeeSign />{earningsData.monthly}</h3>
        </div>
      </div>

      <div className="earnings-info">
        <div className="info-item">
          <p>Completed Deliveries</p>
          <span>{earningsData.completedDeliveries}</span>
        </div>
        <div className="info-item">
          <p>Total Tips</p>
          <span><FaRupeeSign />{earningsData.tips}</span>
        </div>
        <div className="info-item">
          <p>Payment Status</p>
          <span className={earningsData.paymentStatus === "Paid" ? "paid" : "unpaid"}>
            {earningsData.paymentStatus}
          </span>
        </div>
        <div className="info-item">
          <p>Last Payment</p>
          <span><BsCalendarDate /> {earningsData.lastPaymentDate}</span>
        </div>
      </div>
    </div>
  );
};

export default DeliveryEarnings;
