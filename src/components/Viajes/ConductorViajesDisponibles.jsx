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

const ViajesConductor = () => {
  const token = JSON.parse(localStorage.getItem("token"))
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogAction, setDialogAction] = useState("")
  const [showChat, setShowChat] = useState(false)
  const [activeChatViajeId, setActiveChatViajeId] = useState(null)
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(6)
  const toast = useRef(null)

  useEffect(() => {
    if (token) {
      fetchViajesConductor()
    }
  }, [token])

  const fetchViajesConductor = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/viajes/disponibles`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
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

  const confirmStartTrip = (trip) => {
    setSelectedTrip(trip)
    setDialogAction("start")
    setShowDialog(true)
  }

  const handleStartTrip = async () => {
    if (!selectedTrip) return
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/viajes/${selectedTrip.id}/iniciar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setViajes(viajes.filter((viaje) => viaje.id !== selectedTrip.id))
        toast.current.show({ severity: "success", summary: "Éxito", detail: "Viaje iniciado", life: 3000 })
      } else {
        throw new Error("No se pudo iniciar el viaje")
      }
    } catch (error) {
      toast.current.show({ severity: "error", summary: "Error", detail: error.message, life: 3000 })
    } finally {
      setShowDialog(false)
      setSelectedTrip(null)
    }
  }

  const confirmDeleteTrip = (trip) => {
    setSelectedTrip(trip)
    setDialogAction("delete")
    setShowDialog(true)
  }

  const handleDeleteTrip = async () => {
    if (!selectedTrip) return
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/viajes/${selectedTrip.id}/eliminar`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setViajes(viajes.filter((viaje) => viaje.id !== selectedTrip.id))
        toast.current.show({ severity: "success", summary: "Éxito", detail: "Viaje eliminado", life: 3000 })
      } else {
        throw new Error("No se pudo eliminar el viaje")
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
              <i className="pi pi-dollar"></i>
              <span>Precio: ${viaje.precio}</span>
            </div>
            {viaje.observaciones && (
              <div className="detail-item trip-observaciones">
                <i className="pi pi-info-circle"></i>
                <span>Observaciones: {viaje.observaciones}</span>
              </div>
            )}
          </div>

          <div className="trip-actions">
            <Button
              label=""
              icon="pi pi-trash"
              className="p-button-danger"
              onClick={() => confirmDeleteTrip(viaje)}
            />
            <Button
              label=""
              icon="pi pi-comments"
              className="p-button-secondary"
              onClick={() => handleOpenChat(viaje.id)}
            />
            <Button
              label="Comenzar"
              icon="pi pi-play"
              className="p-button-warning"
              onClick={() => confirmStartTrip(viaje)}
            />
          </div>
        </Card>
      </div>
    )
  }

  const renderDialogContent = () => {
    if (dialogAction === "delete") {
      return (
        <>
          <p>¿Estás seguro de que deseas eliminar este viaje?</p>
          <div className="dialog-footer">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => setShowDialog(false)}
              className="p-button-text"
            />
            <Button label="Confirmar" icon="pi pi-check" onClick={handleDeleteTrip} className="p-button-danger" />
          </div>
        </>
      )
    } else if (dialogAction === "start") {
      return (
        <>
          <p>¿Estás seguro de que deseas comenzar este viaje?</p>
          <div className="dialog-footer">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => setShowDialog(false)}
              className="p-button-text"
            />
            <Button label="Confirmar" icon="pi pi-check" onClick={handleStartTrip} className="p-button-success" />
          </div>
        </>
      )
    }
    return null
  }

  return (
    <>
      <Card title="Viajes Ofrecidos" className="card p-4" style={{ borderRadius: "12px" }}>
        <Toast ref={toast} />

        {loading ? (
          <div className="loading-container">
            <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem", color: "#3b82f6" }}></i>
            <div className="mt-2">Cargando viajes...</div>
          </div>
        ) : viajes.length === 0 ? (
          <div className="empty-container">
            <i className="pi pi-info-circle" style={{ fontSize: "2rem", color: "#64748b" }}></i>
            <p className="empty-message">No has creado ningún viaje.</p>
          </div>
        ) : (
          <>
            <div className="trips-grid">{viajes.slice(first, first + rows).map((viaje) => renderTripCard(viaje))}</div>

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

      {/* Dialog for confirmations */}
      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header={dialogAction === "delete" ? "Confirmar eliminación" : "Comenzar Viaje"}
        footer={null}
      >
        {renderDialogContent()}
      </Dialog>

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

export default ViajesConductor

