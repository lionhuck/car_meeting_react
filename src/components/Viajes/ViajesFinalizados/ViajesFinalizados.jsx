import { useState, useEffect, useRef } from "react"
import { Toast } from "primereact/toast"
import { Card } from "primereact/card"
import { Button } from "primereact/button"
import { Divider } from "primereact/divider"
import { Paginator } from "primereact/paginator"
import { Rating } from "primereact/rating"
import '../../Common/TripCard.css'
import CalificarConductorDialog from "../../Calificacion/CalificarConductorDialog.jsx"
import EstrellasCalificacion from "../../Calificacion/EstrellasCalificacion.jsx"
import ViajesFinalizadosModal from "./ViajesFinalizadosModal.jsx"

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
  const [calificacionesUsuario, setCalificacionesUsuario] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [modalVisible, setModalVisible] = useState(false)
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
      const response = await fetch(`${API_URL}/calificaciones/usuario`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setCalificacionesUsuario(data)
      }
    } catch (error) {
      console.error("Error al obtener calificaciones:", error)
    }
  }

  const handleCalificarConductor = (viaje) => {
    setViajeSeleccionado(viaje)
    setDialogVisible(true)
  }

  const handleCalificacionExitosa = (nuevaCalificacion) => {
    // Actualizar la lista de calificaciones
    setCalificacionesUsuario([...calificacionesUsuario, {
      id_viaje: viajeSeleccionado.id,
      id_calificado: viajeSeleccionado.conductor.id,
      estrellas: nuevaCalificacion.estrellas
    }])
    
    // Cerrar el diálogo
    setDialogVisible(false)
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

  const getCalificacionViaje = (viajeId) => {
    return calificacionesUsuario.find(c => c.id_viaje === viajeId) || null
  }

  const yaCalificado = (viajeId) => {
    return calificacionesUsuario.some(c => c.id_viaje === viajeId)
  }


  const handleCardClick = (viaje) => {
    setSelectedTrip(viaje)
    setModalVisible(true)
  }

  const renderTripCard = (viaje) => {
    const calificacion = getCalificacionViaje(viaje.id)
    return (
      <div className="trip-card" key={viaje.id} style={{ cursor: 'pointer' }}>
        <Card onClick={() => handleCardClick(viaje)}>
          <div className="trip-card-header">
            <div className="trip-route">
              <div className="origin">
                <i className="pi pi-map-marker"></i>
                <span>{viaje.origen.nombre}
                      {viaje.origen.provincia ? `, ${viaje.origen.provincia.nombre}` : '' || "No disponible"}
                </span>
              </div>
              <div className="route-arrow">
                <i className="pi pi-arrow-right"></i>
              </div>
              <div className="destination">
                <i className="pi pi-flag"></i>
                <span>{viaje.destino.nombre}
                      {viaje.destino.provincia ? `, ${viaje.destino.provincia.nombre}` : '' || "No disponible"}
                </span>
              </div>
            </div>
          </div>

          <Divider />

          <div className="trip-details">
            <div className="detail-item">
              <i className="pi pi-calendar"></i>
              <span><strong>Inicio: </strong>{formatDate(viaje.hora_inicio_real)}</span>
            </div>
            <div className="detail-item">
              <i className="pi pi-clock"></i>
              <span><strong>Fin: </strong>{formatDate(viaje.hora_finalizacion_real)}</span>
            </div>
            <div className="detail-item">
              <i className="pi pi-user" style={{ color: "black" }}></i>
              <span><strong>Conductor: </strong>
                {tipoViaje === "conductor" ? "Usted" : `${viaje.conductor?.nombre} ${viaje.conductor?.apellido}`}
                </span>
            </div>
            <div className="detail-item">
              <i className="pi pi-dollar" style={{ color: "green" }}></i>
              <span><strong>Precio: </strong>${viaje.precio?.toFixed(2) || "No disponible"}</span>
            </div>
            {tipoViaje === "pasajero" && (
              <div className="detail-item">
                <i className="pi pi-star" style={{ color: "gold" }}></i>
                <span><strong>Calificaciónes:</strong>
                  <EstrellasCalificacion 
                    usuarioId={viaje.conductor?.id} 
                    token={token} 
                    tipo="conductor"
                  />
                </span>
              </div>
              )}
            {tipoViaje === "conductor" && (
              <div className="detail-item">
                <i className="pi pi-star" style={{ color: "gold" }}></i>
                <span><strong>Calificaciónes:</strong>
                  <EstrellasCalificacion 
                    usuarioId={viaje.conductor?.id}
                    token={token} 
                    tipo="conductor"
                  />
                  </span>
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

          
          {/* Mostrar indicador de ya calificado con estrellas */}
          {tipoViaje === "pasajero" && calificacion && (
            <div className="mt-3">
              <div className="flex align-items-center text-sm">
                <i className="pi pi-check-circle mr-2 text-green-500"></i>
                <span className="mr-2">Tu calificación:</span>
                <Rating value={calificacion.estrellas} readOnly cancel={false} stars={5} className="text-sm" />
              </div>
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

      <ViajesFinalizadosModal
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        tripDetails={selectedTrip}
        formatDate={formatDate}
        tipoViaje={tipoViaje} // Añade esta línea
      />

      {/* Modal para calificar conductor */}
      {viajeSeleccionado && (
        <CalificarConductorDialog
          visible={dialogVisible}
          onHide={() => setDialogVisible(false)}
          viajeId={viajeSeleccionado.id}
          conductor={viajeSeleccionado.conductor}
          token={token}
          toast={toast}
          onCalificacionExitosa={handleCalificacionExitosa}
        />
      )}
    </>
  )
}

export default ViajesFinalizados