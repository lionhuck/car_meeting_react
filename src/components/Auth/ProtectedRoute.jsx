// 1. Primero, creamos un componente ProtectedRoute
// components/Auth/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Verificar si existe un token en localStorage
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token; // Convierte a booleano, true si existe un token
  };

  // Si no está autenticado, redirige al login
  // Si está autenticado, renderiza los componentes hijos (Outlet)
  return isAuthenticated() ? <Outlet /> : <Navigate to="/inicio-sesion" />;
};

export default ProtectedRoute;