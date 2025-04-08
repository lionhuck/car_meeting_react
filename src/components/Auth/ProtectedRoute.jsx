import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Intenta realizar una petición a una ruta protegida para verificar el token
        const response = await fetch(`${API_URL}/perfil`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${JSON.parse(token)}`
          }
        });

        if (!response.ok) {
          // Si el token es inválido o ha expirado, cierra la sesión
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error al verificar el token:', error);
        // Si hay un error, asumimos que el token es inválido
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkTokenValidity();
  }, []);

  if (isLoading) {
    // Muestra un indicador de carga mientras se verifica el token
    return <div>Cargando...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/inicio-sesion" />;
};

export default ProtectedRoute;