import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/dashboard.css';

const SidebarLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => sidebarOpen && setSidebarOpen(false);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h2 className="sidebar-logo">🚴 DeliveryBoy</h2>
        <nav>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeSidebar}>
            🏠 Home
          </Link>
          <Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''} onClick={closeSidebar}>
            📦 Orders
          </Link>
          <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''} onClick={closeSidebar}>
            👤 Profile
          </Link>
          <Link to="/earnings" className={location.pathname === '/earnings' ? 'active' : ''} onClick={closeSidebar}>
            💰 Earnings
          </Link>
          <Link to="/logout" className={location.pathname === '/logout' ? 'active' : ''} onClick={closeSidebar}>
            🚪 Logout
          </Link>
        </nav>
      </div>

      {/* Hamburger button for mobile */}
      <button className="menu-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Content Area */}
      <div className={`main-content ${sidebarOpen ? 'blur' : ''}`} onClick={closeSidebar}>
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;
