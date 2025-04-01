import { useState, useEffect, useRef } from "react"
import { Toast } from "primereact/toast"
import { Card } from "primereact/card"
import { Button } from "primereact/button"
import { Divider } from "primereact/divider"
import { Paginator } from "primereact/paginator"
import '../Common/TripCard.css'
import CalificarConductorDialog from "../Calificacion/CalificarConductorDialog.jsx"
import EstrellasCalificacion from "../Calificacion/EstrellasCalificacion.jsx"

const API_URL = import.meta.env.VITE_API_URL

const ViajesFinalizados = () => {
  const token = JSON.parse(localStorage.getItem("token"))
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [tipoViaje, setTipoViaje] = useState("conductor")
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(6)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [viajeSeleccionado, setViajeSeleccionado] = useState(null)
  const [viajesCalificados, setViajesCalificados] = useState([])
  const toast = useRef(null)

  useEffect(() => {
    if (token) {
      fetchViajesCompletados()
      fetchCalificacionesRealizadas()
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

  // Función para obtener las calificaciones ya realizadas
  const fetchCalificacionesRealizadas = async () => {
    try {
      const response = await fetch(`${API_URL}/calificaciones/realizadas`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setViajesCalificados(data.map(c => c.id_viaje))
      }
    } catch (error) {
      console.error("Error al obtener calificaciones:", error)
    }
  }

  const handleCalificarConductor = (viaje) => {
    setViajeSeleccionado(viaje)
    setDialogVisible(true)
  }

  const handleCalificacionExitosa = () => {
    // Actualizar la lista de viajes calificados
    if (viajeSeleccionado) {
      setViajesCalificados([...viajesCalificados, viajeSeleccionado.id])
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

  const yaCalificado = (viajeId) => {
    return viajesCalificados.includes(viajeId)
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
              <span>Inicio: {formatDate(viaje.hora_inicio_real)}</span>
            </div>
            <div className="detail-item">
              <i className="pi pi-dollar"></i>
              <span>Precio: ${viaje.precio?.toFixed(2) || "No disponible"}</span>
            </div>
            <div className="detail-item">
              <i className="pi pi-user"></i>
              <span>
                {tipoViaje === "conductor" ? "Usted" : `Conductor: ${viaje.conductor?.nombre} ${viaje.conductor?.apellido}`}
              </span>
            </div>
            {tipoViaje === "pasajero" && (
              <div className="detail-item">
                <EstrellasCalificacion 
                  usuarioId={viaje.conductor?.id} 
                  token={token} 
                  tipo="conductor"
                />
              </div>
              )}
            {tipoViaje === "conductor" && (
              <div className="detail-item">
                <i className="pi pi-star"></i>
                <EstrellasCalificacion 
                  usuarioId={viaje.conductor?.id} // Asumiendo que token contiene el ID del usuario
                  token={token} 
                  tipo="conductor"
                />
              </div>
            )}
          </div>

          {/* Mostrar botón de calificar solo para viajes como pasajero que no se han calificado */}
          {tipoViaje === "pasajero" && !yaCalificado(viaje.id) && (
            <div className="trip-actions mt-3">
              <Button
                label="Calificar Conductor"
                icon="pi pi-star"
                severity="info"
                className="p-button-sm"
                onClick={() => handleCalificarConductor(viaje)}
              />
            </div>
          )}

          
          {/* Mostrar indicador de ya calificado */}
          {tipoViaje === "pasajero" && yaCalificado(viaje.id) && (
            <div className="mt-3 flex align-items-center text-sm text-gray-600">
              <i className="pi pi-check-circle mr-2 text-green-500"></i>
              Conductor ya calificado
            </div>
          )}
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
          label={tipoViaje === "conductor" ? "Ver mis viajes como Pasajero" : "Ver mis viajes como Conductor"}
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

      {/* Modal para calificar conductor */}
      {viajeSeleccionado && (
        <CalificarConductorDialog
          visible={dialogVisible}
          onHide={() => setDialogVisible(false)}
          viajeId={viajeSeleccionado.id}
          conductor={viajeSeleccionado.conductor}
          token={token}
          toast={toast}
        />
      )}
    </>
  )
}

export default ViajesFinalizados