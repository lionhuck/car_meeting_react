import { Card } from "primereact/card"
import { Button } from "primereact/button"

const NoAccessCard = () => {
  return (
    <Card title="Acceso restringido" className="p-4 access-card" style={{ borderRadius: "12px" }}>
      <p>Debes iniciar sesión para ver los viajes disponibles.</p>
      <Button 
        label="Iniciar sesión" 
        icon="pi pi-sign-in" 
        className="p-button-primary login-btn" 
        onClick={() => window.location.href = "/login"} 
      />
    </Card>
  )
}

export default NoAccessCard