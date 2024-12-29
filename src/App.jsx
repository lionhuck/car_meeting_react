import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Menubar } from 'primereact/menubar';
import ViajesView from './components/Viajes/ViewViajes';
import LoginUser from './components/Users/LoginUser';
import CreateUser from './components/Users/CreateUsers';
import CreateViaje from './components/Viajes/CreateViaje';
function App() {
  const items = [
    {label: 'Viajes', icon:'pi pi-home', url:'/viajes'},
    {label: 'CargarUsuario', icon:'pi pi-users', url:'/nuevo-usuario'},
    {label: 'Login', icon:'pi pi-users', url:'/inicio-sesion'},
    {label: 'CargarViaje', icon:'pi pi-users', url:'/cargar-viaje'},
    
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
      </Routes>
    </BrowserRouter>
  )
}

export default App