import { Card } from "primereact/card"
import { Button } from "primereact/button"
import { Divider } from "primereact/divider"
import EstrellasCalificacion from "../../Calificacion/EstrellasCalificacion"

const ViajeCard = ({ viaje, token, onJoinTrip, onShowDetails, formatDate }) => {
  return (
    <div className="trip-card">
      <Card onClick={() => onShowDetails(viaje)}>
        <div className="trip-card-header">
          <div className="trip-route">
            <div className="origin">
              <i className="pi pi-map-marker"></i>
              <span>{viaje.origen.nombre}</span>
            </div>
            <div className="route-arrow">
              <i className="pi pi-arrow-right"></i>
            </div>
            <div className="destination">
              <i className="pi pi-flag"></i>
              <span>{viaje.destino.nombre}</span>
            </div>
          </div>
          <div className="trip-date">
            <i className="pi pi-calendar"></i>
            <span>{formatDate(viaje.fecha_salida)}</span>
          </div>
        </div>

        <Divider />

        <div className="trip-details">
          <div className="detail-item">
            <i className="pi pi-user"></i>
            <span>
              Conductor: {viaje.conductor.nombre} {viaje.conductor.apellido}
            </span>
          </div>
          <EstrellasCalificacion 
            usuarioId={viaje.conductor.id} 
            token={token} 
            tipo="conductor"
          />
          <div className="detail-item">
            <i className="pi pi-dollar"></i>
            <span>Precio: ${viaje.precio}</span>
          </div>
          <div className="detail-item">
            <i className="pi pi-users"></i>
            <span>Asientos disponibles: {viaje.asientos_disponibles}</span>
          </div>
          {viaje.observaciones && (
            <div className="detail-item trip-observaciones">
              <i className="pi pi-info-circle"></i>
              <span title={viaje.observaciones}>Observaciones: {viaje.observaciones}</span>
            </div>
          )}
        </div>

        <div className="trip-actions">
          <Button
            label="Unirse al viaje"
            icon="pi pi-check"
            className="trip-join-btn"
            severity="success"
            onClick={(e) => {
              e.stopPropagation(); // Evitar que se abra el detalle al hacer clic en el botón
              onJoinTrip(viaje);
            }}
            disabled={!viaje.activo || viaje.asientos_disponibles <= 0}
          />
        </div>
      </Card>
    </div>
  );
};

export default ViajeCard;