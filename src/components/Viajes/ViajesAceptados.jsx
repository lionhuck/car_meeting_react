"use client"

import { useState, useEffect, useRef } from "react"
import { Toast } from "primereact/toast"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { Card } from "primereact/card"
import { Divider } from "primereact/divider"
import { Paginator } from "primereact/paginator"
import Chat from "../Chat/Chat"
import '../Common/TripCard.css'

const ViajesPasajero = () => {
  const token = JSON.parse(localStorage.getItem("token"))
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [activeChatViajeId, setActiveChatViajeId] = useState(null)
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(6)
  const toast = useRef(null)

  useEffect(() => {
    if (token) {
      fetchViajesPasajero()
    }
  }, [token])

  const fetchViajesPasajero = async () => {
    try {
      const response = await fetch("http://localhost:5000/viajes/pasajero/disponibles", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setViajes(data)
      } else {
        throw new Error("Error al obtener los viajes")
      }
    } catch (error) {
      toast.current.show({ severity: "error", summary: "Error", detail: error.message, life: 3000 })
    } finally {
      setLoading(false)
    }
  }

  const confirmUnjoinTrip = (trip) => {
    setSelectedTrip(trip)
    setShowDialog(true)
  }

  const handleUnjoinTrip = async () => {
    if (!selectedTrip) return
    try {
      const response = await fetch(`http://localhost:5000/viajes/${selectedTrip.id}/eliminar/pasajero`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setViajes(viajes.filter((viaje) => viaje.id !== selectedTrip.id))
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Saliste del viaje exitosamente",
          life: 3000,
        })
      } else {
        throw new Error("No se pudo salir del viaje")
      }
    } catch (error) {
      toast.current.show({ severity: "error", summary: "Error", detail: error.message, life: 3000 })
    } finally {
      setShowDialog(false)
      setSelectedTrip(null)
    }
  }

  const handleOpenChat = (viajeId) => {
    setActiveChatViajeId(viajeId)
    setShowChat(true)
  }

  const handleCloseChat = () => {
    setShowChat(false)
    setActiveChatViajeId(null)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }

  const renderTripCard = (viaje) => {
    return (
      <div className="trip-card" key={viaje.id}>
        <Card>
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
            <div className="detail-item">
              <i className="pi pi-dollar"></i>
              <span>Precio: ${viaje.precio}</span>
            </div>
            {viaje.observaciones && (
              <div className="trip-observaciones">
                <i className="pi pi-info-circle"></i>
                <span>Observaciones: {viaje.observaciones}</span>
              </div>
            )}
          </div>

          <div className="trip-actions">
            <Button
              label="Salir del viaje"
              icon="pi pi-times"
              className="p-button-danger"
              onClick={() => confirmUnjoinTrip(viaje)}
            />
            <Button
              label="Chat"
              icon="pi pi-comments"
              className="p-button-secondary"
              onClick={() => handleOpenChat(viaje.id)}
            />
          </div>
        </Card>
      </div>
    )
  }
  return (
    <>
      <Card title="Viajes Aceptados" className="p-4" style={{ borderRadius: "12px" }}>
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
              <Button label="Confirmar" icon="pi pi-check" onClick={handleUnjoinTrip} className="p-button-danger" />
            </div>
          }
        >
          <p>¿Estás seguro de que deseas salir de este viaje?</p>
        </Dialog>

        {loading ? (
          <div className="loading-container">
            <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem", color: "#3b82f6" }}></i>
            <div className="mt-2">Cargando viajes...</div>
          </div>
        ) : viajes.length === 0 ? (
          <div className="empty-container">
            <i className="pi pi-info-circle" style={{ fontSize: "2rem", color: "#64748b" }}></i>
            <p className="empty-message">No te has unido a ningún viaje.</p>
          </div>
        ) : (
          <>
            <div className="trips-grid">
              {viajes.slice(first, first + rows).map((viaje) => renderTripCard(viaje))}
            </div>

            <div className="pagination-container">
              <Paginator
                first={first}
                rows={rows}
                totalRecords={viajes.length}
                onPageChange={onPageChange}
                className="custom-paginator"
              />
            </div>
          </>
        )}
      </Card>

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
        {activeChatViajeId && <Chat viajeId={activeChatViajeId} onClose={handleCloseChat} />}
      </Dialog>
    </>
  )
}

export default ViajesPasajero

