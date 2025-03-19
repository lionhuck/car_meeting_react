import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'

// Importa los estilos de PrimeReact
// Importaciones de estilos de PrimeReact
import "primereact/resources/themes/lara-light-indigo/theme.css";  // tema
import "primereact/resources/primereact.min.css";                  // core
import "primeicons/primeicons.css";                                // iconos                                  // grid system (opcional)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
