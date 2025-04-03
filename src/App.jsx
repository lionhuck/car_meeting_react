// 3. Finalmente, actualizamos el App.jsx con las rutas protegidas
// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import ViajesView from './components/Viajes/ListadoViajes/ListadoViajes';
import LoginUser from './components/Auth/LoginUser';
import CreateViaje from './components/Viajes/CreateViaje';
import ViajesPasajero from './components/Viajes/ViajesAceptados';
import RegistroUsuario from './components/Auth/RegisterUsers';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import ViajesPropuestos from './components/Viajes/ConductorViajesDisponibles';
import ViajesEnCursoConductor from './components/Viajes/ConductorViajesEnCurso';
import ViajesFinalizadosConductor from './components/Viajes/ViajesFinalizados';
import VerificarEmail from './components/Auth/VerificarEmail';
import ReenviarVerificacion from './components/Auth/ReenviarVerificacion';
import EditarPerfil from './components/Auth/EditarPerfil';
import SolicitarReset from './components/Auth/SolicitarReset';
import ResetPassword from './components/Auth/ResetPassword';


function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/inicio-sesion" element={<LoginUser />} />
          <Route path="/registro-usuario" element={<RegistroUsuario />} />
          <Route path="/verificar-email/:token" element={<VerificarEmail />} />
          <Route path="/reenviar-verificacion" element={<ReenviarVerificacion />} />
          <Route path="/solicitar-reset" element={<SolicitarReset />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ViajesView />} />
            <Route path="/viajes" element={<ViajesView />} />
            <Route path="/cargar-viaje" element={<CreateViaje />} />
            <Route path="/viajes-aceptados" element={<ViajesPasajero />} />
            <Route path="/viajes-propuestos" element={<ViajesPropuestos />} />
            <Route path="/viajes-en-curso" element={<ViajesEnCursoConductor />} />
            <Route path="/viajes-finalizados" element={<ViajesFinalizadosConductor/>} />
            <Route path="/editar-perfil" element={<EditarPerfil />} />
          </Route>
          
          {/* Ruta para páginas no encontradas */}
          <Route path="*" element={<Navigate to="/viajes" />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;