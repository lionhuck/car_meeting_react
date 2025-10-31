// DemoBanner.jsx
import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const DemoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState({ email: false, password: false });
  
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  // Auto-ocultar después de 15 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied({ ...copied, [field]: true });
      setTimeout(() => {
        setCopied({ ...copied, [field]: false });
      }, 2000);
    });
  };

  if (!isDemoMode || !isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        animation: 'slideIn 0.5s ease-out'
      }}
    >
      <Card
        style={{
          background: 'linear-gradient(135deg, #1832a5ff 0%, #764ba2 100%)',
          border: 'none',
          color: 'white',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          padding: '0.8rem 1.2rem',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
          <i className="pi pi-info-circle" style={{ fontSize: '1.2rem' }}></i>
          <span style={{ fontWeight: 'bold' }}>Modo Demo Activo</span>
        </div>
      </Card>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default DemoBanner;