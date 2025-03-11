// 3. Finalmente, actualizamos el App.jsx con las rutas protegidas
// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import ViajesView from './components/Viajes/ListadoViajes';
import LoginUser from './components/Auth/LoginUser';
import CreateViaje from './components/Viajes/CreateViaje';
import ViajesPasajero from './components/Viajes/ViajesAceptados';
import RegistroUsuario from './components/Auth/RegisterUsers';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import ViajesPropuestos from './components/Viajes/ConductorViajesDisponibles';
import ViajesEnCursoConductor from './components/Viajes/ConductorViajesEnCurso';
import ViajesFinalizadosConductor from './components/Viajes/ViajesFinalizados';
function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/inicio-sesion" element={<LoginUser />} />
          <Route path="/registro-usuario" element={<RegistroUsuario />} />
          
          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ViajesView />} />
            <Route path="/viajes" element={<ViajesView />} />
            <Route path="/cargar-viaje" element={<CreateViaje />} />
            <Route path="/viajes-aceptados" element={<ViajesPasajero />} />
            <Route path="/viajes-propuestos" element={<ViajesPropuestos />} />
            <Route path="/viajes-en-curso" element={<ViajesEnCursoConductor />} />
            <Route path="/viajes-finalizados" element={<ViajesFinalizadosConductor/>} />
          </Route>
          
          {/* Ruta para páginas no encontradas */}
          <Route path="*" element={<Navigate to="/inicio-sesion" />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;