import React, { useState } from 'react';
import './Header.css';
import { FaCartPlus, FaBars } from 'react-icons/fa';

const Header = ({ user, onLogout, onLogin }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const goToOrders = () => {
    window.location.href = '/orders';
    closeMenu();
  };

  const goToCart = () => {
    window.location.href = '/cart';
    closeMenu();
  };

  return (
    <nav className="navbar navbar-expand-lg header-white shadow-sm px-4 py-2 position-relative">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        {/* Logo */}
        <div className="d-flex align-items-center">
          <img src="/logo.jpg" alt="Logo" className="logo-img me-2" />
        </div>

        {/* Cart Icon Mobile */}
        <button className="btn text-dark d-lg-none" onClick={goToCart}>
          <FaCartPlus size={20} />
        </button>

        {/* Hamburger Menu */}
        <button className="navbar-toggler" type="button" onClick={toggleMenu}>
          <FaBars size={18} />
        </button>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <ul className="navbar-nav text-center">
            {user ? (
              <>
                <li className="nav-item fw-semibold text-dark">Hi, {user.name}</li>
                <li className="nav-item">
                  <button className="btn btn-outline-dark w-75 mt-2" onClick={goToOrders}>
                    My Orders
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-dark w-75 mt-2" onClick={goToCart}>
                    Cart
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger w-75 mt-2" onClick={() => { onLogout(); closeMenu(); }}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-dark w-75 mt-2" onClick={() => { onLogin(); closeMenu(); }}>
                  Login / Signup
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Desktop Menu */}
        <div className="collapse navbar-collapse d-none d-lg-flex justify-content-end" id="navbarContent">
          <ul className="navbar-nav gap-3 align-items-center">
            {user ? (
              <>
                <li className="nav-item text-dark fw-semibold">Hi, {user.name}</li>
                <li className="nav-item">
                  <button className="btn btn-outline-dark" onClick={goToOrders}>
                    My Orders
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-dark" onClick={goToCart}>
                    Cart
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger" onClick={onLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-outline-dark" onClick={onLogin}>
                  Login / Signup
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
