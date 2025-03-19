import React from 'react';
import '../Common/Footer.css'; // Crearemos este archivo a continuación

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Comparte tu viaje</h3>
          <p>Conectamos conductores y pasajeros para viajes más económicos y sustentables.</p>
        </div>
        <div className="footer-section">
          <div className="social-icons">
            <a href="https://www.instagram.com/leon_huck_/" target="_blank" rel="noopener noreferrer">
              <i className="pi pi-instagram"></i>
            </a>
            <a href="https://www.linkedin.com/in/leon-federico-huck/" target="_blank" rel="noopener noreferrer">
              <i className="pi pi-linkedin"></i>
            </a>
            <a href="mailto:leonfedericohuck007@gmail.com" target="_blank" rel="noopener noreferrer">
              <i className="pi pi-google"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CAR_MEETING. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;