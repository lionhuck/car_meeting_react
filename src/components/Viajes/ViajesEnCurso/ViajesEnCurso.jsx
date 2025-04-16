import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Paginator } from "primereact/paginator";
import "../../Common/TripCard.css";
import ViajesEnCursoModal from "./ViajesEnCursoModal";

const API_URL = import.meta.env.VITE_API_URL;

const ViajesEnCurso = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [finalizingTrip, setFinalizingTrip] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(6);
  const [modalVisible, setModalVisible] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    if (token) {
      fetchViajesEnCurso();
    }
  }, [token]);

  const fetchViajesEnCurso = async () => {
    try {
      const response = await fetch(`${API_URL}/viajes/en-curso`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setViajes(data);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Error al obtener los viajes en curso"
        );
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

  const finalizarViaje = async (viajeId) => {
    try {
      setFinalizingTrip(true);
      const response = await fetch(
        `${API_URL}/viajes/${viajeId}/finalizar/conductor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id_viaje: viajeId }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setViajes(viajes.filter((viaje) => viaje.id !== viajeId));
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: data.mensaje || "Viaje finalizado",
          life: 3000,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "No se pudo finalizar el viaje");
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    } finally {
      setFinalizingTrip(false);
    }
  };

  const confirmFinishTrip = (trip) => {
    setSelectedTrip(trip);
    setShowDialog(true);
  };

  const handleFinishTrip = () => {
    if (selectedTrip) {
      finalizarViaje(selectedTrip.id);
      setShowDialog(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
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
          </div>

          <Divider />

          <div className="trip-details">
            <div className="detail-item">
              <i className="pi pi-dollar" style={{ color: "green" }}></i>
              <span>
                <strong>Precio:</strong> ${viaje.precio}
              </span>
            </div>
            <div className="detail-item">
              <i className="pi pi-calendar"></i>
              <span>
                <strong>Hora de Inicio:</strong>{" "}
                {formatDate(viaje.hora_inicio_real)}
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
              label="Finalizar Viaje"
              icon="pi pi-check"
              className="p-button-success"
              onClick={(e) => {
                e.stopPropagation();
                confirmFinishTrip(viaje);
              }}
              disabled={finalizingTrip}
            />
          </div>
        </Card>
      </div>
    );
  };

  return (
    <>
      <Card
        title="Viajes en curso"
        className="p-4"
        style={{ borderRadius: "12px" }}
      >
        <Toast ref={toast} />

        <Dialog
          visible={showDialog}
          onHide={() => setShowDialog(false)}
          header="Confirmar finalización"
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
                onClick={handleFinishTrip}
                className="p-button-success"
                disabled={finalizingTrip}
              />
            </div>
          }
        >
          <p>¿Estás seguro de que deseas finalizar este viaje?</p>
        </Dialog>

        {loading ? (
          <div className="loading-container">
            <i
              className="pi pi-spin pi-spinner"
              style={{ fontSize: "2rem", color: "#3b82f6" }}
            ></i>
            <div className="mt-2">Cargando viajes en curso...</div>
          </div>
        ) : viajes.length === 0 ? (
          <div className="empty-container">
            <i
              className="pi pi-info-circle"
              style={{ fontSize: "2rem", color: "#64748b" }}
            ></i>
            <p className="empty-message">No tienes viajes en curso.</p>
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

      {/* Modal for trip details */}
      <ViajesEnCursoModal
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        tripDetails={selectedTrip}
        formatDate={formatDate} // asegurate de que esta función esté definida
      />
    </>
  );
};

export default ViajesEnCurso;
