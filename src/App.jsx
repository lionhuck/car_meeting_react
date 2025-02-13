import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Menubar } from 'primereact/menubar';
import ViajesView from './components/Viajes/ViewViajes';
import LoginUser from './components/Users/LoginUser';
import CreateUser from './components/Users/CreateUsers';
import CreateViaje from './components/Viajes/CreateViaje';
import ViajesPasajero from './components/Viajes/MisViajes';
function App() {
  const items = [
    {label: 'Viajes', icon:'pi pi-car', url:'/viajes'},
    {label: 'Crear Viaje', icon:'pi pi-warehouse', url:'/cargar-viaje'},
    {label: 'Mis Viajes', icon:'pi pi-bookmark', url:'/mis-viajes'},
    {label: 'Crear Usuario', icon:'pi pi-user', url:'/nuevo-usuario'},
    {label: 'Login', icon:'pi pi-sign-in', url:'/inicio-sesion'},
    
  ]
  return (
    <BrowserRouter>
      <Menubar model={items} /> 
      <h1>CAR MEETING</h1>
      <Routes>
        <Route path="/" element={<LoginUser/>} />
        <Route path="/viajes" element={<ViajesView />} />
        <Route path="/nuevo-usuario" element={<CreateUser />} />
        <Route path="/inicio-sesion" element={<LoginUser />} />
        <Route path="/cargar-viaje" element={<CreateViaje />} />
        <Route path="/mis-viajes" element={<ViajesPasajero />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App