import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import EstrellasCalificacion from "../../Calificacion/EstrellasCalificacion";
import { useState } from "react";
const ViajeCard = ({ viaje, token, onJoinTrip, onShowDetails, formatDate }) => {
  const [isJoining, setIsJoining] = useState(false);
  return (
    <div className="trip-card" key={viaje.id} style={{ cursor: "pointer" }}>
      <Card onClick={() => onShowDetails(viaje)}>
        <div className="trip-card-header">
          <div className="trip-route">
            <div className="origin">
              <i className="pi pi-map-marker"></i>
              <span>
                {viaje.origen.nombre}
                {viaje.origen.provincia
                  ? `, ${viaje.origen.provincia.nombre}`
                  : ""}
              </span>
            </div>
            <div className="route-arrow">
              <i className="pi pi-arrow-right"></i>
            </div>
            <div className="destination">
              <i className="pi pi-flag"></i>
              <span>
                {viaje.destino.nombre}
                {viaje.destino.provincia
                  ? `, ${viaje.destino.provincia.nombre}`
                  : ""}
              </span>
            </div>
          </div>
          <div className="trip-date">
            <i className="pi pi-calendar"></i>
            <span>
              <strong>{formatDate(viaje.fecha_salida)}</strong>
            </span>
          </div>
        </div>

        <Divider />

        <div className="trip-details">
          <div className="detail-item">
            <i className="pi pi-user" style={{ color: "black" }}></i>
            <span>
              <strong>Conductor/ra: </strong>
              <div>
                {viaje.conductor.nombre} {viaje.conductor.apellido}
              </div>
            </span>
          </div>
          <div className="detail-item">
            <i className="pi pi-star" style={{ color: "gold" }}></i>
            <span>
              <strong>Calificaciónes:</strong>
              <EstrellasCalificacion
                usuarioId={viaje.conductor.id}
                token={token}
                tipo="conductor"
              />
            </span>
          </div>
          <div className="detail-item">
            <i className="pi pi-dollar" style={{ color: "green" }}></i>
            <span>
              <strong>Precio: </strong>${viaje.precio}
            </span>
          </div>
          <div className="detail-item">
            <i className="pi pi-users" style={{ color: "red" }}></i>
            <span>
              {" "}
              <strong>Lugares disponibles: </strong>
              {viaje.asientos_disponibles}
            </span>
          </div>
          <div className="detail-item trip-observaciones">
            <i className="pi pi-info-circle" style={{ color: "orange" }}></i>
            <span>
              <strong>Observaciones: </strong>
              {viaje.observaciones?.trim()
                ? viaje.observaciones
                : "Sin observaciones"}
            </span>
          </div>
        </div>
        <div className="trip-actions">
          <Button
          label={
            !viaje.puedeUnirse ? "Ya formás parte" : 
            isJoining ? "Procesando..." : "Unirse al viaje"
          }
          icon={viaje.puedeUnirse ? "pi pi-check" : "pi pi-ban"}
          className="trip-join-btn"
          severity={viaje.puedeUnirse ? "success" : "secondary"}
          onClick={(e) => {
            e.stopPropagation();
            onJoinTrip(viaje);
          }}
          disabled={!viaje.activo || viaje.asientos_disponibles <= 0 || isJoining || !viaje.puedeUnirse}
          loading={isJoining}
        />
        </div>
      </Card>
    </div>
  );
};

export default ViajeCard;
