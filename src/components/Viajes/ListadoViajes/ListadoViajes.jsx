import { useState, useEffect, useRef } from "react"
import { Toast } from "primereact/toast"
import { Card } from "primereact/card"
import { Paginator } from "primereact/paginator"
import ViajeCard from "./ViajeCard"
import ViajeFilters from "./ViajeFilters"
import ViajeDetailsModal from "./ViajeDetailsModal"
import EquipajeModal from "../ViajeCompartido/EquipajeModal"
import NoAccessCard from "./NoAccessCard"
import "../../Common/TripCard.css"

const API_URL = import.meta.env.VITE_API_URL

const ViajesView = () => {
  const token = JSON.parse(localStorage.getItem("token"))
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [globalFilterValue, setGlobalFilterValue] = useState("")
  const [equipajeModalVisible, setEquipajeModalVisible] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [filteredViajes, setFilteredViajes] = useState([])
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(6)
  const [showTripDetailsModal, setShowTripDetailsModal] = useState(false)
  const [selectedTripDetails, setSelectedTripDetails] = useState(null)
  const [isJoining, setIsJoining] = useState(false)
  const toast = useRef(null)

  useEffect(() => {
    if (token){
      fetchViajes()
      initFilters()
    } else {
      setLoading(false)
    } 
  }, [token])

  useEffect(() => {
    applyFilters()
  }, [viajes, globalFilterValue, filters])

  const fetchViajes = async () => {
    try {
      const response = await fetch(`${API_URL}/viajes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        
        // Verificar para cada viaje si el usuario puede unirse
        const viajesConEstado = await Promise.all(
          data.map(async (viaje) => {
            const puedeUnirseResponse = await fetch(
              `${API_URL}/viajes/${viaje.id}/puede-unirse`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            
            if (puedeUnirseResponse.ok) {
              const puedeUnirseData = await puedeUnirseResponse.json();
              return {
                ...viaje,
                puedeUnirse: puedeUnirseData.puede_unirse,
                mensajeUnirse: puedeUnirseData.mensaje
              };
            }
            return viaje;
          })
        );
        
        setViajes(viajesConEstado);
        setFilteredViajes(viajesConEstado);
      } else {
        console.error("Error al obtener los viajes");
      }
    } catch (error) {
      console.error("Error en la solicitud de viajes:", error);
    } finally {
      setLoading(false);
    }
  };

  const initFilters = () => {
    setFilters({
      origen: null,
      destino: null,
      fecha: null,
    })
    setGlobalFilterValue("")
  }

  const applyFilters = () => {
    let filtered = [...viajes]

    // Global search
    if (globalFilterValue) {
      filtered = filtered.filter(
        (viaje) =>
          viaje.origen.nombre.toLowerCase().includes(globalFilterValue.toLowerCase()) ||
          viaje.destino.nombre.toLowerCase().includes(globalFilterValue.toLowerCase()) ||
          `${viaje.conductor.nombre} ${viaje.conductor.apellido}`
            .toLowerCase()
            .includes(globalFilterValue.toLowerCase())
      )
    }

    // Specific filters
    if (filters.origen) {
      filtered = filtered.filter((viaje) => viaje.origen.nombre.toLowerCase().includes(filters.origen.toLowerCase()))
    }

    if (filters.destino) {
      filtered = filtered.filter((viaje) => viaje.destino.nombre.toLowerCase().includes(filters.destino.toLowerCase()))
    }

    if (filters.fecha) {
      const filterDate = new Date(filters.fecha)
      filtered = filtered.filter((viaje) => {
        const viajeDate = new Date(viaje.fecha_salida)
        return viajeDate.toDateString() === filterDate.toDateString()
      })
    }

    setFilteredViajes(filtered)
    setFirst(0)
  }

  const clearFilter = () => {
    initFilters()
  }

  const handleJoinTrip = (tripData) => {
    if (!token) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Debe iniciar sesión para unirse a un viaje",
        life: 3000,
      })
      return
    }
    setSelectedTrip(tripData)
    setEquipajeModalVisible(true);
  }

  const handleAddPassenger = async (equipajeId) => {
    if (!selectedTrip || !equipajeId) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Por favor seleccione un tipo de equipaje",
        life: 3000,
      });
      return;
    }
  
    if (isJoining) return;
  
    setIsJoining(true);
  
    try {
      const response = await fetch(`${API_URL}/viajes/${selectedTrip.id}/pasajeros`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          equipaje_id: equipajeId,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setViajes((prevViajes) =>
          prevViajes.map((viaje) =>
            viaje.id === selectedTrip.id ? { ...viaje, asientos_disponibles: viaje.asientos_disponibles - 1 } : viaje
          )
        );
  
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Te has unido al viaje exitosamente",
          life: 3000,
        });
        setEquipajeModalVisible(false);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.error || "Error al unirse al viaje",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error al unirse al viaje:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error de conexión al intentar unirse al viaje",
        life: 3000,
      });
    } finally {
      setIsJoining(false);
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
    })
  }

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }

  const handleShowDetails = (viaje) => {
    setSelectedTripDetails(viaje)
    setShowTripDetailsModal(true)
  }

  if (!token) {
    return <NoAccessCard />
  }

  return (
    <Card title="Listado de Viajes" className="card p-4 main-card" style={{ borderRadius: "12px" }}>
      <Toast ref={toast} position={window.innerWidth <= 768 ? "bottom-center" : "top-right"} />
      
      <ViajeFilters 
        filters={filters} 
        setFilters={setFilters} 
        clearFilter={clearFilter} 
      />

      {loading ? (
        <div className="loading-container">
          <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem", color: "#3b82f6" }}></i>
          <div className="mt-2">Cargando viajes...</div>
        </div>
      ) : filteredViajes.length > 0 ? (
        <>
          <div className="trips-grid">
            {filteredViajes
              .slice(first, first + rows)
              .map((viaje) => (
                <ViajeCard
                  key={viaje.id}
                  viaje={viaje}
                  token={token}
                  onJoinTrip={handleJoinTrip}
                  onShowDetails={handleShowDetails}
                  formatDate={formatDate}
                />
              ))}
          </div>
          <div className="paginator-container">
            <Paginator
              first={first}
              rows={rows}
              totalRecords={filteredViajes.length}
              onPageChange={onPageChange}
              template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink' }}
            />
          </div>
        </>
      ) : (
        <div className="no-trips-message">
          <i className="pi pi-info-circle"></i>
          <span> No se encontraron viajes.</span>
        </div>
      )}

      <ViajeDetailsModal 
        visible={showTripDetailsModal}
        onHide={() => setShowTripDetailsModal(false)}
        tripDetails={selectedTripDetails}
        formatDate={formatDate}
        token={token}
        onJoinTrip={handleJoinTrip}
      />

      <EquipajeModal
        visible={equipajeModalVisible}
        onHide={() => setEquipajeModalVisible(false)}
        onSelect={handleAddPassenger}
      />
    </Card>
  )
}
    
export default ViajesView