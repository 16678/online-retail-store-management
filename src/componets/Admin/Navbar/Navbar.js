import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => (
  <div className="navbar-container">
    <div className="nav-card">
      <Link to="/admin/add-product">
        <p>&#43;</p>
        <span>Add Product</span>
      </Link>
    </div>
    {/* <div className="nav-card">
      <Link to="/admin/add-category">
        <p>&#9776;</p>
        <span>Add Category</span>
      </Link>
    </div> */}
    <div className="nav-card">
      <Link to="/admin/view-products">
        <p>&#128065;</p>
        <span>View Products</span>
      </Link>
    </div>
    <div className="nav-card">
      <Link to="/admin/orders">
        <p>&#128230;</p>
        <span>Orders</span>
      </Link>
    </div>
    <div className="nav-card">
      <Link to="/admin/users">
        <p>👤</p>
        <span>Users</span>
      </Link>
    </div>
    <div className="nav-card">
      <Link to="/admin/add-admin">
        <p>👤</p>
        <span>Add Admin</span>
      </Link>
    </div>
  </div>
);

export default Navbar;
