import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Importa los estilos de PrimeReact
import 'primereact/resources/themes/saga-blue/theme.css'; // Cambia "saga-blue" por tu tema deseado
import 'primereact/resources/primereact.min.css'; // Estilos base de PrimeReact
import 'primeicons/primeicons.css'; // Iconos de PrimeReact



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
