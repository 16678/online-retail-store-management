import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBars, FaPlus, FaEye, FaBoxOpen, FaUsers, FaUserPlus, FaLayerGroup, FaChartBar,
  FaBell, FaCogs, FaExchangeAlt, FaMoneyBill, FaTruck, FaUserShield
} from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="navbar-wrapper">
      <div className="navbar-header">
        <h2>Admin Panel</h2>
        <button className="main-menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars /> Main Menu
        </button>
      </div>

      <div className={`navbar-container ${menuOpen ? 'show-mobile-menu' : ''}`}>
        {/* Product Management */}
        <div className="nav-card"><Link to="/admin/add-product"><div className="icon"><FaPlus size={24} /></div><span>Add Product</span></Link></div>
        <div className="nav-card"><Link to="/admin/view-products"><div className="icon"><FaEye size={24} /></div><span>View Products</span></Link></div>
        <div className="nav-card"><Link to="/admin/CategoryUploader"><div className="icon"><FaLayerGroup size={24} /></div><span>Manage Categories</span></Link></div>
        <div className="nav-card"><Link to="/admin/AdminCartManager"><div className="icon"><FaLayerGroup size={24} /></div><span>Admin Cart Management</span></Link></div>

        {/* Order & Delivery */}
        <div className="nav-card"><Link to="/admin/orders"><div className="icon"><FaBoxOpen size={24} /></div><span>Track Orders</span></Link></div>
        <div className="nav-card"><Link to="/admin/DeliveryDashboard"><div className="icon"><FaTruck size={24} /></div><span>Delivery Dashboard</span></Link></div>
        <div className="nav-card"><Link to="/Admin/AddDeliveryBoy"><div className="icon"><FaUserPlus size={24} /></div><span>Add Delivery Boy</span></Link></div>
        <div className="nav-card"><Link to="/admin/DeliveryBoyList"><div className="icon"><FaUsers size={24} /></div><span>Delivery Boys List</span></Link></div>
        <div className="nav-card"><Link to="/admin/AssignOrders"><div className="icon"><FaExchangeAlt size={24} /></div><span>Assign Orders</span></Link></div>
        <div className="nav-card"><Link to="/Admin/DeliveryBoyQRCode"><div className="icon"><FaMoneyBill size={24} /></div><span>Delivery Assign QRCode</span></Link></div>
        <div className="nav-card"><Link to="/admin/delivery-earnings"><div className="icon"><FaMoneyBill size={24} /></div><span>Delivery Earnings</span></Link></div>

        {/* Customers & Admins */}
        <div className="nav-card"><Link to="/admin/customers"><div className="icon"><FaUsers size={24} /></div><span>Customers</span></Link></div>
        <div className="nav-card"><Link to="/admin/add-admin"><div className="icon"><FaUserPlus size={24} /></div><span>Add Admin</span></Link></div>
        <div className="nav-card"><Link to="/admin/manage-roles"><div className="icon"><FaUserShield size={24} /></div><span>Admin Roles</span></Link></div>

        {/* Reports & Settings */}
        <div className="nav-card"><Link to=""><div className="icon"><FaChartBar size={24} /></div><span>Reports</span></Link></div>
        <div className="nav-card"><Link to="/admin/notifications"><div className="icon"><FaBell size={24} /></div><span>Notifications</span></Link></div>
        <div className="nav-card"><Link to="/admin/settings"><div className="icon"><FaCogs size={24} /></div><span>Settings</span></Link></div>
      </div>
    </div>
  );
};

export default Navbar;
