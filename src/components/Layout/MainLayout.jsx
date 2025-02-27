import { Menubar } from 'primereact/menubar';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Añadimos esta línea para detectar cambios de ruta
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar autenticación cada vez que cambie la ruta o se monte el componente
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location.pathname]); // Añadimos location.pathname como dependencia

  // Crear menús diferentes según autenticación
  const authenticatedItems = [
    {label: 'Viajes', icon:'pi pi-car', url:'/viajes'},
    {label: 'Crear Viaje', icon:'pi pi-warehouse', url:'/cargar-viaje'},
    {label: 'Mis Viajes', icon:'pi pi-bookmark', url:'/mis-viajes'},
  ];

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/inicio-sesion');
  };

  // Crear botón de cerrar sesión
  const end = isAuthenticated ? (
    <Button
      label="Cerrar Sesión"
      icon="pi pi-sign-out"
      className="p-button-danger"
      onClick={handleLogout}
    />
  ) : null;

  return isAuthenticated ? (
    <div>
      <Menubar model={authenticatedItems} end={<Button label="Cerrar Sesión" icon="pi pi-sign-out" className="p-button-danger" onClick={handleLogout} />} />
      <h1>CAR MEETING</h1>
      <div className="content">{children}</div>
    </div>
  ) : (
    <div>{children}</div>
  );
};

export default MainLayout;