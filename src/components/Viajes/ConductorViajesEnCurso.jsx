"use client"

import { useState, useEffect, useRef } from "react"
import { Toast } from "primereact/toast"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { Card } from "primereact/card"
import { Divider } from "primereact/divider"
import { Paginator } from "primereact/paginator"
import "../Common/TripCard.css"

const ViajesEnCurso = () => {
  const token = JSON.parse(localStorage.getItem("token"))
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [finalizingTrip, setFinalizingTrip] = useState(false)
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(6)
  const toast = useRef(null)

  useEffect(() => {
    if (token) {
      fetchViajesEnCurso()
    }
  }, [token])

  const fetchViajesEnCurso = async () => {
    try {
      const response = await fetch("http://localhost:5000/viajes/en-curso", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setViajes(data)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al obtener los viajes en curso")
      }
    } catch (error) {
      toast.current.show({ severity: "error", summary: "Error", detail: error.message, life: 3000 })
    } finally {
      setLoading(false)
    }
  }

  const finalizarViaje = async (viajeId) => {
    try {
      setFinalizingTrip(true)
      const response = await fetch(`http://localhost:5000/viajes/${viajeId}/finalizar/conductor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_viaje: viajeId }),
      })

      if (response.ok) {
        const data = await response.json()
        setViajes(viajes.filter((viaje) => viaje.id !== viajeId))
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: data.mensaje || "Viaje finalizado",
          life: 3000,
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "No se pudo finalizar el viaje")
      }
    } catch (error) {
      toast.current.show({ severity: "error", summary: "Error", detail: error.message, life: 3000 })
    } finally {
      setFinalizingTrip(false)
    }
  }

  const confirmFinishTrip = (trip) => {
    setSelectedTrip(trip)
    setShowDialog(true)
  }

  const handleFinishTrip = () => {
    if (selectedTrip) {
      finalizarViaje(selectedTrip.id)
      setShowDialog(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleString("es-ES", {
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
                <span>{viaje.origen ? viaje.origen.nombre : "-"}</span>
              </div>
              <div className="route-arrow">
                <i className="pi pi-arrow-right"></i>
              </div>
              <div className="destination">
                <i className="pi pi-flag"></i>
                <span>{viaje.destino ? viaje.destino.nombre : "-"}</span>
              </div>
            </div>
          </div>

          <Divider />

          <div className="trip-details">
            <div className="detail-item">
              <i className="pi pi-calendar"></i>
              <span>Hora de Inicio: {formatDate(viaje.hora_inicio_real)}</span>
            </div>
            {viaje.observaciones && (
              <div className="detail-item">
                <i className="pi pi-info-circle"></i>
                <span>Observaciones: {viaje.observaciones}</span>
              </div>
            )}
          </div>

          <div className="trip-actions">
            <Button
              label="Finalizar Viaje"
              icon="pi pi-check"
              className="p-button-success"
              onClick={() => confirmFinishTrip(viaje)}
              disabled={finalizingTrip}
            />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <Card title="Viajes en curso" className="p-4" style={{ borderRadius: "12px" }}>
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
          <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem", color: "#3b82f6" }}></i>
          <div className="mt-2">Cargando viajes en curso...</div>
        </div>
      ) : viajes.length === 0 ? (
        <div className="empty-container">
          <i className="pi pi-info-circle" style={{ fontSize: "2rem", color: "#64748b" }}></i>
          <p className="empty-message">No tienes viajes en curso.</p>
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
  )
}

export default ViajesEnCurso

