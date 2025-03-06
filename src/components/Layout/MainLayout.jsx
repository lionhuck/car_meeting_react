import { Sidebar } from 'primereact/sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';

const MainLayout = ({ children, title = 'CAR MEETING' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [visible, setVisible] = useState(true); // Sidebar visible por defecto

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location.pathname]);

  const authenticatedItems = [
    { label: 'Viajes', icon: 'pi pi-car', url: '/viajes' },
    { label: 'Crear Viaje', icon: 'pi pi-warehouse', url: '/cargar-viaje' },
    { label: 'Viajes Aceptados', icon: 'pi pi-bookmark', url: '/viajes-aceptados' },
    { label: 'Viajes Propuestos', icon: 'pi pi-check', url: '/viajes-propuestos' },
    { label: 'Viajes en Curso', icon: 'pi pi-spinner', url: '/viajes-en-curso' },
    { label: 'Viajes Finalizados', icon: 'pi pi-check-circle', url: '/viajes-finalizados' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/inicio-sesion');
  };

  return isAuthenticated ? (
    <div className="layout">
      <Sidebar visible={visible} onHide={() => setVisible(false)} className="p-sidebar-sm">
        <h2>Menú</h2>
        {authenticatedItems.map((item, index) => (
          <Button
            key={index}
            label={item.label}
            icon={item.icon}
            className="p-button-text w-full"
            onClick={() => navigate(item.url)}
          />
        ))}
        <Button
          label="Cerrar Sesión"
          icon="pi pi-sign-out"
          className="p-button-danger w-full mt-3"
          onClick={handleLogout}
        />
      </Sidebar>

      <div className="main-content">
        <Button icon="pi pi-bars" className="p-button-text" onClick={() => setVisible(true)} />
          <h1>{title}</h1>
        <div className="content">{children}</div>
      </div>
    </div>
  ) : (
    <div>{children}</div>
  );
};

export default MainLayout;
