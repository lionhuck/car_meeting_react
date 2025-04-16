import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { useState } from "react"
import EstrellasCalificacion from "../../Calificacion/EstrellasCalificacion"

const ViajeDetailsModal = ({ visible, onHide, tripDetails, formatDate, token, onJoinTrip }) => {
  if (!tripDetails) return null
  const [isJoining, setIsJoining] = useState(false)
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
          <span><strong>Origen:</strong> {tripDetails.origen.nombre}, {tripDetails.origen.provincia.nombre}</span>
        </div>
        <div className="detail-item">
          <i className="pi pi-flag"></i>
          <span><strong>Destino:</strong> {tripDetails.destino.nombre}, {tripDetails.destino.provincia.nombre}</span>
        </div>
        <div className="detail-item">
          <i className="pi pi-calendar"></i>
          <span><strong>Fecha:</strong> {formatDate(tripDetails.fecha_salida)}</span>
        </div>
        <div className="detail-item">
          <i className="pi pi-user" style={{ color: 'black' }}></i>
          <span><strong>Conductor/ra:</strong> {tripDetails.conductor.nombre} {tripDetails.conductor.apellido}</span>
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
          <i className="pi pi-dollar" style={{ color: 'green' }}></i>
          <span><strong>Precio:</strong> ${tripDetails.precio}</span>
        </div>
        <div className="detail-item">
          <i className="pi pi-users" style={{ color: 'red' }}></i>
          <span><strong>Asientos Disponibles:</strong> {tripDetails.asientos_disponibles}</span>
        </div>
        {tripDetails.observaciones && (
          <div className="detail-item">
            <i className="pi pi-info-circle" style={{ color: 'orange' }}></i>
            <div className="observaciones-full">
              <strong>Observaciones:</strong> {tripDetails.observaciones}
            </div>
          </div>
        )}

        <div className="trip-actions">
          <Button
            label={isJoining ? "Procesando..." : "Unirse al viaje"}
            icon="pi pi-check"
            className="trip-join-btn"
            severity="success"
            onClick={() => onJoinTrip(tripDetails)}
            disabled={!tripDetails.activo || tripDetails.asientos_disponibles <= 0 || isJoining || tripDetails.puedeUnirse === false}
            loading={isJoining}
          />
        </div>
      </div>
    </Dialog>
  )
}

export default ViajeDetailsModal