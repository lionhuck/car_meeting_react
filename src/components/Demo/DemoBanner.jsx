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
    }, 15000);

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
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      maxWidth: '400px',
      animation: 'slideIn 0.5s ease-out'
    }}>
      <Card
        style={{
          background: 'linear-gradient(135deg, #1832a5ff 0%, #764ba2 100%)',
          border: 'none',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          color: 'white'
        }}
      >
        <div style={{ position: 'relative' }}>
          <Button
            icon="pi pi-times"
            className="p-button-text"
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              color: 'white'
            }}
            onClick={() => setIsVisible(false)}
          />
          
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <i className="pi pi-info-circle" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
            <h3 style={{ margin: '0.5rem 0', fontSize: '1.3rem' }}>
              Modo Demo
            </h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: '0.5rem 0' }}>
              Usa estas credenciales para probar la aplicación
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '1rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                📧 Email:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <code style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}>
                  demo@carmeeting.com
                </code>
                <Button
                  icon={copied.email ? "pi pi-check" : "pi pi-copy"}
                  className="p-button-sm p-button-rounded"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none'
                  }}
                  onClick={() => copyToClipboard('demo@carmeeting.com', 'email')}
                  tooltip="Copiar"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                🔑 Contraseña:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <code style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}>
                  demo123
                </code>
                <Button
                  icon={copied.password ? "pi pi-check" : "pi pi-copy"}
                  className="p-button-sm p-button-rounded"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none'
                  }}
                  onClick={() => copyToClipboard('demo123', 'password')}
                  tooltip="Copiar"
                />
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '1rem',
            padding: '0.8rem',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '6px',
            fontSize: '0.85rem',
            textAlign: 'center'
          }}>
            <i className="pi pi-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
            Los datos son simulados y no se guardan
          </div>
        </div>
      </Card>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default DemoBanner;