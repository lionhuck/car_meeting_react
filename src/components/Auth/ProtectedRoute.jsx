import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/perfil`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${JSON.parse(token)}`
          }
        });

        if (!response.ok) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          // Redirigir a login con estado para mostrar mensaje
          navigate('/login', { state: { from: location.pathname, sessionExpired: true } });
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error al verificar el token:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login', { state: { from: location.pathname, error: true } });
      } finally {
        setIsLoading(false);
      }
    };

    checkTokenValidity();
  }, [navigate, location.pathname]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isAuthenticated && ['/login', '/inicio-sesion', '/registro', '/registro-usuario', '/solicitar-reset', '/verificar-email', '/reenviar-verificacion'].includes(location.pathname)) {
    return <Navigate to="/viajes" replace />;
  }


  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location.pathname }} />;
  };


export default ProtectedRoute;