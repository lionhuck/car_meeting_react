"use client";

import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Paginator } from "primereact/paginator";
import EstrellasCalificacion from "../../Calificacion/EstrellasCalificacion";
import Chat from "../../Chat/Chat";
import ViajesAceptadosModal from "./ViajesAceptadosModal"; // ajustá el path si es necesario
import "../../Common/TripCard.css";

const API_URL = import.meta.env.VITE_API_URL;

const ViajesPasajero = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeChatViajeId, setActiveChatViajeId] = useState(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(6);
  const [modalVisible, setModalVisible] = useState(false);

  const toast = useRef(null);

  useEffect(() => {
    if (token) {
      fetchViajesPasajero();
    }
  }, [token]);

  const fetchViajesPasajero = async () => {
    try {
      const response = await fetch(`${API_URL}/viajes/pasajero/disponibles`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setViajes(data);
      } else {
        throw new Error("Error al obtener los viajes");
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmUnjoinTrip = (trip) => {
    setSelectedTrip(trip);
    setShowDialog(true);
  };

  const handleUnjoinTrip = async () => {
    if (!selectedTrip) return;
    try {
      const response = await fetch(
        `${API_URL}/viajes/${selectedTrip.id}/eliminar/pasajero`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setViajes(viajes.filter((viaje) => viaje.id !== selectedTrip.id));
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Saliste del viaje exitosamente",
          life: 3000,
        });
      } else {
        throw new Error("No se pudo salir del viaje");
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    } finally {
      setShowDialog(false);
      setSelectedTrip(null);
    }
  };

  const handleOpenChat = (viajeId) => {
    setActiveChatViajeId(viajeId);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setActiveChatViajeId(null);
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

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const handleCardClick = (viaje) => {
    setSelectedTrip(viaje);
    setModalVisible(true);
  };

  const renderTripCard = (viaje) => {
    return (
      <div className="trip-card" key={viaje.id} style={{ cursor: "pointer" }}>
        <Card onClick={() => handleCardClick(viaje)}>
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
                <strong>Conductor/ra:</strong> {viaje.conductor.nombre}{" "}
                {viaje.conductor.apellido}
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
              <span>Precio: ${viaje.precio}</span>
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
              label="Salir del viaje"
              icon="pi pi-times"
              className="p-button-danger"
              onClick={(e) => {
                e.stopPropagation();
                confirmUnjoinTrip(viaje);
              }}
            />
            <Button
              label="Chat"
              icon="pi pi-comments"
              className="p-button-secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenChat(viaje.id);
              }}
            />
          </div>
        </Card>
      </div>
    );
  };
  return (
    <>
      <Card
        title="Viajes Aceptados"
        className="p-4"
        style={{ borderRadius: "12px" }}
      >
        <Toast ref={toast} />

        <Dialog
          visible={showDialog}
          onHide={() => setShowDialog(false)}
          header="Confirmar salida"
          footer={
            <div>
              <Button
                label="Cancelar"
                icon="pi pi-times"
                onClick={() => setShowDialog(false)}
                className="p-button-text"
              />
              <Button
                label="Confirmar"
                icon="pi pi-check"
                onClick={handleUnjoinTrip}
                className="p-button-danger"
              />
            </div>
          }
        >
          <p>¿Estás seguro de que deseas salir de este viaje?</p>
        </Dialog>

        {loading ? (
          <div className="loading-container">
            <i
              className="pi pi-spin pi-spinner"
              style={{ fontSize: "2rem", color: "#3b82f6" }}
            ></i>
            <div className="mt-2">Cargando viajes...</div>
          </div>
        ) : viajes.length === 0 ? (
          <div className="empty-container">
            <i
              className="pi pi-info-circle"
              style={{ fontSize: "2rem", color: "#64748b" }}
            ></i>
            <p className="empty-message">No te has unido a ningún viaje.</p>
          </div>
        ) : (
          <>
            <div className="trips-grid">
              {viajes
                .slice(first, first + rows)
                .map((viaje) => renderTripCard(viaje))}
            </div>

            <div className="pagination-container">
              <Paginator
                first={first}
                rows={rows}
                totalRecords={viajes.length}
                onPageChange={onPageChange}
                template={{
                  layout: "PrevPageLink CurrentPageReport NextPageLink",
                }}
              />
            </div>
          </>
        )}
      </Card>
      <ViajesAceptadosModal
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        tripDetails={selectedTrip}
        formatDate={formatDate} // asegurate de que esta función esté definida
      />

      {/* Chat Modal */}
      <Dialog
        visible={showChat}
        onHide={handleCloseChat}
        header="Chat del Viaje"
        style={{ width: "80vw", maxWidth: "1000px" }}
        maximizable
        modal
        className="p-fluid"
      >
        {activeChatViajeId && (
          <Chat viajeId={activeChatViajeId} onClose={handleCloseChat} />
        )}
      </Dialog>
    </>
  );
};

export default ViajesPasajero;
