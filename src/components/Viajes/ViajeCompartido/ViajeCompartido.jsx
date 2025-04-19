// src/components/Viajes/ViajeCompartido/ViajeCompartido.jsx
import { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { useParams, useNavigate } from "react-router-dom";

import EquipajeModal from "./EquipajeModal";
import "./ViajeCompartido.css"; // Importar el CSS para estilos

const API_URL = import.meta.env.VITE_API_URL;

const ViajeCompartido = () => {
  const { viajeId } = useParams();
  const [viaje, setViaje] = useState(null);
  const [loading, setLoading] = useState(true);
  const [equipajeModalVisible, setEquipajeModalVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    fetchViaje();
  }, [viajeId]);

  const fetchViaje = async () => {
    try {
      const response = await fetch(`${API_URL}/viajes/compartir/${viajeId}`);

      if (response.ok) {
        const data = await response.json();
        setViaje(data);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo obtener información del viaje",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al conectar con el servidor",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnirse = () => {
    if (!isAuthenticated) {
      console.log('Guardando viajeId en localStorage:', viajeId); // Debug
      localStorage.setItem("pendingViajeId", viajeId.toString()); // Asegurar que es string
      navigate("/inicio-sesion"); 
      return;
    }
    setEquipajeModalVisible(true);
  };
;

  const handleEquipajeSelect = async (equipajeId) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await fetch(`${API_URL}/viajes/${viajeId}/pasajeros`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          equipaje_id: equipajeId,
        }),
      });

      if (response.ok) {
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Te has unido al viaje exitosamente",
          life: 3000,
        });

        // Redirigir a la vista de viajes aceptados
        setTimeout(() => {
          navigate("/viajes-aceptados");
        }, 1500);
      } else {
        const error = await response.json();
        throw new Error(error.error || "No pudiste unirte al viaje");
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    } finally {
      setEquipajeModalVisible(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <i
          className="pi pi-spin pi-spinner"
          style={{ fontSize: "2rem", color: "#3b82f6" }}
        ></i>
        <div className="mt-2">Cargando viaje...</div>
      </div>
    );
  }

  if (!viaje) {
    return (
      <div className="empty-container">
        <i
          className="pi pi-exclamation-triangle"
          style={{ fontSize: "2rem", color: "#ef4444" }}
        ></i>
        <p className="empty-message">No se encontró el viaje solicitado.</p>
      </div>
    );
  }

  return (
    <div className="shared-trip-container">
      <Toast ref={toast} position="top-right" />

      <Card title="Viaje Compartido" className="shared-trip-card">
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
              <strong>Conductor: </strong>{viaje.conductor.nombre}
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
              <strong>Lugares disponibles: </strong>
              {viaje.asientos_disponibles}
            </span>
          </div>
          <div className="detail-item ">
            <i className="pi pi-info-circle" style={{ color: "orange" }}></i>
            <span>
              <strong>Observaciones: </strong>
              {viaje.observaciones?.trim()
                ? viaje.observaciones
                : "Sin observaciones"}
            </span>
          </div>
        </div>

        <Divider />

        <div className="trip-actions">
        <Button
          label="Unirme a este viaje"
          icon="pi pi-check"
          className="p-button-success p-button-lg"
          onClick={handleUnirse}
          disabled={viaje.asientos_disponibles <= 0}
        />
        </div>
      </Card>

      <EquipajeModal
        visible={equipajeModalVisible}
        onHide={() => setEquipajeModalVisible(false)}
        onSelect={handleEquipajeSelect}
      />
    </div>
  );
};

export default ViajeCompartido;
