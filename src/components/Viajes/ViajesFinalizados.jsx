"use client"

import { useState, useEffect, useRef } from "react"
import { Toast } from "primereact/toast"
import { Card } from "primereact/card"
import { Button } from "primereact/button"
import { Divider } from "primereact/divider"
import { Paginator } from "primereact/paginator"
import '../Common/TripCard.css'

const API_URL = import.meta.env.VITE_API_URL

const ViajesFinalizados = () => {
  const token = JSON.parse(localStorage.getItem("token"))
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [tipoViaje, setTipoViaje] = useState("conductor")
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(6)
  const toast = useRef(null)

  useEffect(() => {
    if (token) {
      fetchViajesCompletados()
    }
  }, [token, tipoViaje])

  const fetchViajesCompletados = async () => {
    try {
      setLoading(true)
      const endpoint =
        tipoViaje === "conductor"
          ? `${API_URL}/viajes/completados`
          : `${API_URL}/viajes/pasajero/completados`

      const response = await fetch(endpoint, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setViajes(data)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al obtener los viajes completados")
      }
    } catch (error) {
      toast.current.show({ severity: "error", summary: "Error", detail: error.message, life: 3000 })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "No disponible"
    try {
      return new Date(dateString).toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    } catch (e) {
      return "Fecha no disponible"
    }
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
                <span>{viaje.origen?.nombre || "No disponible"}</span>
              </div>
              <div className="route-arrow">
                <i className="pi pi-arrow-right"></i>
              </div>
              <div className="destination">
                <i className="pi pi-flag"></i>
                <span>{viaje.destino?.nombre || "No disponible"}</span>
              </div>
            </div>
          </div>

          <Divider />

          <div className="trip-details">
            <div className="detail-item">
              <i className="pi pi-calendar"></i>
              <span>Hora de Inicio: {formatDate(viaje.hora_inicio_real)}</span>
            </div>
            <div className="detail-item">
              <i className="pi pi-dollar"></i>
              <span>Precio: ${viaje.precio?.toFixed(2) || "No disponible"}</span>
            </div>
            <div className="detail-item">
              <i className="pi pi-user"></i>
              <span>
                Conductor: {viaje.conductor?.nombre} {viaje.conductor?.apellido}
              </span>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <>
      <Card
        title={`Viajes Finalizados Como ${tipoViaje === "conductor" ? "Conductor" : "Pasajero"}`}
        style={{ borderRadius: "12px" }}
      >
        <Toast ref={toast} />
        <div className="mb-4 text-center toggle-view-button">
          <Button
            label={tipoViaje === "conductor" ? "Ver como Pasajero" : "Ver como Conductor"}
            icon={tipoViaje === "conductor" ? "pi pi-user" : "pi pi-car"}
            onClick={() => setTipoViaje(tipoViaje === "conductor" ? "pasajero" : "conductor")}
            className="p-button p-button-info"
          />
        </div>
        {loading ? (
          <div className="loading-container">
            <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem", color: "#3b82f6" }}></i>
            <div className="mt-2">Cargando viajes completados...</div>
          </div>
        ) : viajes.length === 0 ? (
          <div className="empty-container">
            <i className="pi pi-info-circle" style={{ fontSize: "2rem", color: "#64748b" }}></i>
            <p className="empty-message">No tienes viajes completados.</p>
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
                template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink' }} 
              />
            </div>
          </>
        )}
      </Card>
    </>
  )
}

export default ViajesFinalizados

