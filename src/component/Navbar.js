import React, { useState } from 'react';
import './Navbar.css'; // Import the CSS file for styling
import logo from "./Img/logo.png"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Toggle button on the left */}
      <button className="toggle-button" onClick={toggleSidebar}>
        <i className="fa-solid fa-bars"></i>
      </button>

      {/* Logo on the left for normal screens, centered for responsive screens */}
      <div className="navbar-center">
        <a href='/'>
          <img src={logo} alt="Aema Logo" className="logo" />
        </a>
      </div>

      {/* Icons on the right */}
      <div className="navbar-right">

        <div className="navbar-icons">

          <a href="/">
            <i className="fa-solid fa-home"></i> Home
          </a>

          <a href="/Cart">
            <i className="fa-solid fa-cart-shopping"></i> Cart
          </a>
          <a href="/Account">
            <i className="fa-solid fa-user"></i> Account
          </a>

          <a href="/Order">
            <i className="fa-solid fa-boxes-packing"></i>Order
          </a>
        </div>
      </div>

      {/* Sidebar that opens from the left */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <a href="/Cart">
          <i className="fa-solid fa-cart-shopping"></i> Cart
        </a>
        <a href="/Account">
          <i className="fa-solid fa-user"></i> Account
        </a>

        <a href="/Order">
          <i className="fa-solid fa-boxes-packing"></i>Order
        </a>
      </div>

      {/* Overlay to close sidebar when clicking outside */}
      <div className={`overlay ${isOpen ? 'active' : ''}`} onClick={closeSidebar}></div>
    </nav>
  );
};

export default Navbar;  