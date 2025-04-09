import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import EstrellasCalificacion from "../../Calificacion/EstrellasCalificacion";

const ViajesPropuestosModal = ({ visible, onHide, tripDetails, formatDate, onJoinTrip }) => {
  const token = JSON.parse(localStorage.getItem("token"))
  if (!tripDetails) return null

  return (
    <Dialog
      header={`Viaje a ${tripDetails.destino.nombre}`}
      visible={visible}
      style={{ width: '50vw' }}
      onHide={onHide}
    >
      <div className="trip-details-modal">
        <div className="detail-item">
          <i className="pi pi-map-marker"></i>
          <span><strong>Origen:</strong> {tripDetails.origen.nombre}</span>
        </div>
        <div className="detail-item">
          <i className="pi pi-flag"></i>
          <span><strong>Destino:</strong> {tripDetails.destino.nombre}</span>
        </div>
        <div className="detail-item">
          <i className="pi pi-calendar"></i>
          <span><strong>Fecha:</strong> {formatDate(tripDetails.fecha_salida)}</span>
        </div>
        <div className="detail-item">
          <i className="pi pi-user" style={{ color: 'black' }}></i>
          <span><strong>Conductor/ra: </strong>Usted</span>
        </div>
        <div className="detail-item">
          <i className="pi pi-star" style={{ color: 'gold' }}></i>
          <span><strong>Calificaciónes:</strong></span>
          <EstrellasCalificacion 
            usuarioId={tripDetails.conductor.id} 
            token={token} 
            tipo="conductor"
          />
        </div>
        <div className="detail-item">
          <i className="pi pi-users" style={{ color: 'red' }}></i>
          <span><strong>Lugares disponibles:</strong> {tripDetails.asientos_disponibles}</span>
        </div>
        <div className="detail-item">
          <i className="pi pi-dollar" style={{ color: 'green' }}></i>
          <span><strong>Precio:</strong> ${tripDetails.precio}</span>
        </div>
        {tripDetails.observaciones && (
          <div className="detail-item">
            <i className="pi pi-info-circle" style={{ color: 'orange' }}></i>
            <div className="observaciones-full">
              <strong>Observaciones:</strong> {tripDetails.observaciones}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  )
}

export default ViajesPropuestosModal