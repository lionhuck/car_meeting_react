import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Menubar } from 'primereact/menubar';
import ViajesView from './components/Viajes/ViajesView';
import LoginUser from './components/Users/LoginUser';

function App() {
  const items = [
    {label: 'Viajes', icon:'pi pi-home', url:'/viajes'},
    // {label: 'CargarUsuario', icon:'pi pi-users', url:'/nuevo-usuario'},
    {label: 'Login', icon:'pi pi-users', url:'/inicio-sesion'},
    ]
  return (
    <BrowserRouter>
      <Menubar model={items} /> 
      <h1>CAR MEETING</h1>
      <Routes>
        <Route path='/viajes' element={<ViajesView/>}></Route>
        {/* <Route path='/nuevo-usuario' element={<CreateUser/>}></Route> */}
        <Route path='/inicio-sesion' element={<LoginUser/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App