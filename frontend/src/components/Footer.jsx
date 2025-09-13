import React from 'react';
import { FaPhoneAlt, FaMapMarkerAlt, FaUser, FaEnvelope } from 'react-icons/fa';
import logo from '../../public/logo.jpg'; // Update path as needed
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer-container bg-dark text-white">
      <div className="container">
        <div className="d-flex align-items-center justify-content-center   flex-column flex-md-row gap-5">
      <img src={logo} alt="Annapurna Logo" className="footer-logo" />
      <div className="text-center text-md-start">
          <h3 className="footer-title ">Annapurna Rice & General Stores</h3>
          <p className="text-light">Your trusted store for rice, groceries, and essentials in Vijayawada</p>
        </div>
      </div>
        {/* Footer Content */}
        <div className="row text-center text-md-start">
          {/* Contact Info */}
          <div className="col-md-4">
            <h5 className="text-warning mb-3">📞 Contact</h5>
            <p><FaPhoneAlt className="me-2 text-success" /> 9951226232</p>
            <p><FaPhoneAlt className="me-2 text-success" /> 9390502418</p>
            <p><FaEnvelope className="me-2 text-info" /> annapurnastore@gmail.com</p>
          </div>

          {/* Address */}
          <div className="col-md-4 mb-4">
            <h5 className="text-warning mb-3">📍 Address</h5>
            <p><FaMapMarkerAlt className="me-2 text-danger" />
              Door No 6-128/1 Shop No : 3 & 4, Near SBI BANK, Near Apparna Towers, Pingalivenkaya Vari Street<br />
              Ramavarappadu vijayawada, Andhra Pradesh - 520008
            </p>
          </div>

          {/* Owner Info */}
          <div className="col-md-4 mb-4">
            <h5 className="text-warning mb-3">🧑 Owner</h5>
            <p><FaUser className="me-2 text-primary" /> B. Mohan Krishna</p>
            <p>Serving our community with quality and care since 2016.</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-4 pb-3">
          <small className="text-secondary">
            &copy; {new Date().getFullYear()} Annapurna Rice & General Stores. All rights reserved.
          </small>
        </div>
      </div>

      {/* Full Width Google Map */}
      <div className="footer-map mt-4">
        <iframe
          title="Annapurna Shop Location"
          width="100%"
          height="200"
          style={{ border: 0 }}
          src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3825.0662044559326!2d80.679947!3d16.522755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTbCsDMxJzIxLjkiTiA4MMKwNDAnNDcuOCJF!5e0!3m2!1sen!2sin!4v1753985776796!5m2!1sen!2sin"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Footer;
