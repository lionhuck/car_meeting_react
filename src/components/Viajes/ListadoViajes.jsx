import { useState, useEffect, useRef } from "react"
import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { Toast } from "primereact/toast"
import { Dialog } from "primereact/dialog"
import { Dropdown } from "primereact/dropdown"
import { Card } from "primereact/card"
import { InputText } from "primereact/inputtext"
import { Divider } from "primereact/divider"
import { Paginator } from "primereact/paginator"
import "../Common/TripCard.css"

const API_URL = import.meta.env.VITE_API_URL

const ViajesView = () => {
  const token = JSON.parse(localStorage.getItem("token"))
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [globalFilterValue, setGlobalFilterValue] = useState("")
  const [showLuggageDialog, setShowLuggageDialog] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [selectedLuggage, setSelectedLuggage] = useState(null)
  const [luggageTypes, setLuggageTypes] = useState([])
  const [filteredViajes, setFilteredViajes] = useState([])
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(6)
  const [showFilters, setShowFilters] = useState(false)
  const toast = useRef(null)
  const isMobile = window.innerWidth <= 768

  useEffect(() => {
    if (token){
      fetchViajes()
      fetchLuggageTypes()
      initFilters()
    } else {
      setLoading(false)
    } 
  }, [token])

  useEffect(() => {
    applyFilters()
  }, [viajes, globalFilterValue, filters])

  // Add event listener for window resize
  useEffect(() => {
    const handleResize = () => {
      // Adjust rows based on screen size
      const width = window.innerWidth
      if (width <= 480) {
        setRows(3)
      } else if (width <= 768) {
        setRows(4)
      } else {
        setRows(6)
      }
    }

    window.addEventListener('resize', handleResize)
    // Call once on mount to set initial value
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const fetchLuggageTypes = async () => {
    try {
      const response = await fetch(`${API_URL}/equipajes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLuggageTypes(
          data.map((type) => ({
            label: type.categoria,
            value: type.id,
          })),
        )
      } else {
        console.error("Error al obtener tipos de equipaje")
      }
    } catch (error) {
      console.error("Error en la solicitud de tipos de equipaje:", error)
    }
  }

  const fetchViajes = async () => {
    try {
      const response = await fetch(`${API_URL}/viajes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setViajes(data)
        setFilteredViajes(data)
      } else {
        console.error("Error al obtener los viajes")
      }
    } catch (error) {
      console.error("Error en la solicitud de viajes:", error)
    } finally {
      setLoading(false)
    }
  }

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
            .includes(globalFilterValue.toLowerCase()),
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
    setShowLuggageDialog(true)
  }

  const handleAddPassenger = async () => {
    if (!selectedTrip || !selectedLuggage) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Por favor seleccione un tipo de equipaje",
        life: 3000,
      })
      return
    }

    try {
      const response = await fetch(`${API_URL}/viajes/${selectedTrip.id}/pasajeros`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          equipaje_id: selectedLuggage,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setViajes((prevViajes) =>
          prevViajes.map((viaje) =>
            viaje.id === selectedTrip.id ? { ...viaje, asientos_disponibles: viaje.asientos_disponibles - 1 } : viaje,
          ),
        )

        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Te has unido al viaje exitosamente",
          life: 3000,
        })

        handleDialogClose()
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.error || "Error al unirse al viaje",
          life: 3000,
        })
      }
    } catch (error) {
      console.error("Error al unirse al viaje:", error)
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error de conexión al intentar unirse al viaje",
        life: 3000,
      })
    }
  }

  const handleDialogClose = () => {
    setShowLuggageDialog(false)
    setSelectedTrip(null)
    setSelectedLuggage(null)
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

  const renderLuggageDialog = () => {
    const dialogFooter = (
      <div className="luggage-dialog-footer">
        <Button label="Cancelar" icon="pi pi-times" onClick={handleDialogClose} className="p-button-text" />
        <Button
          label="Confirmar"
          icon="pi pi-check"
          onClick={handleAddPassenger}
          autoFocus
          severity="success"
          style={{
            backgroundColor: "#22c55e",
            border: "none",
            color: "white",
          }}
        />
      </div>
    )

    return (
      <Dialog
        visible={showLuggageDialog}
        style={{ width: isMobile ? "90%" : "450px" }}
        header="Seleccionar Equipaje"
        modal
        className="p-fluid responsive-dialog"
        footer={dialogFooter}
        onHide={handleDialogClose}
        breakpoints={{ "960px": "75vw", "640px": "90vw" }}
      >
        <div className="field">
          <label htmlFor="luggage" className="font-bold">
            Tipo de Equipaje
          </label>
          <Dropdown
            id="luggage"
            value={selectedLuggage}
            options={luggageTypes}
            onChange={(e) => setSelectedLuggage(e.value)}
            placeholder="Seleccione un tipo de equipaje"
            className="w-full"
          />
        </div>
      </Dialog>
    )
  }

  const renderFilters = () => {
    return (
      <div className="filters-container">
      <div className="filters-header">
        <Button
        icon={showFilters ? "pi pi-times" : "pi pi-filter"}
        className="p-button-rounded p-button-text "
        onClick={() => setShowFilters(!showFilters)}
        aria-label={showFilters ? "Ocultar filtros" : "Mostrar filtros"}
        tooltip={showFilters ? "Ocultar filtros" : "Mostrar filtros"}
        />
      </div>
      
      {showFilters && (
        <div className="specific-filters">
        <div className="filter-item">
          <span className="p-input-icon-left w-full">
          {!filters.origen && <i className="pi pi-map-marker ml-2" />}
          <InputText
            value={filters.origen || ""}
            onChange={(e) => setFilters({ ...filters, origen: e.target.value })}
            placeholder="   Origen"
            className="filter-input w-full"
          />
          </span>
        </div>
      
        <div className="filter-item">
          <span className="p-input-icon-left w-full">
          {!filters.destino && <i className="pi pi-flag ml-2" />}
          <InputText
            value={filters.destino || ""}
            onChange={(e) => setFilters({ ...filters, destino: e.target.value })}
            placeholder="   Destino"
            className="filter-input w-full"
          />
          </span>
        </div>
      
        <div className="filter-item">
          <Calendar
          value={filters.fecha}
          onChange={(e) => setFilters({ ...filters, fecha: e.value })}
          dateFormat="dd/mm/yy"
          placeholder="Fecha"
          showIcon
          className="filter-calendar w-full"
          touchUI={isMobile}
          />
        </div>
      
        <div className="filter-item">
          <Button
          icon="pi pi-filter-slash"
          tooltip="Limpiar filtros"
          onClick={clearFilter}
          className="p-button-rounded p-button-info clear-filter-btn w-full"
          label={isMobile ? "Limpiar" : "Limpiar filtros"}
          />
        </div>
        </div>
      )}
      </div>
    )
  }

  if (!token) {
    return (
      <Card title="Acceso restringido" className="p-4 access-card" style={{ borderRadius: "12px" }}>
        <p>Debes iniciar sesión para ver los viajes disponibles.</p>
        <Button label="Iniciar sesión" icon="pi pi-sign-in" className="p-button-primary login-btn" onClick={() => window.location.href = "/login"} />
      </Card>
    );
  }

  const renderViajeCard = (viaje) => {
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
            <div className="detail-item">
              <i className="pi pi-users"></i>
              <span>Asientos disponibles: {viaje.asientos_disponibles}</span>
            </div>
            {viaje.observaciones && (
              <div className="detail-item trip-observaciones">
                <i className="pi pi-info-circle"></i>
                <span title={viaje.observaciones}>Observaciones: {viaje.observaciones}</span>
              </div>
            )}
          </div>

          <div className="trip-actions">
            <Button
              label="Unirse al viaje"
              icon="pi pi-check"
              className="trip-join-btn"
              onClick={() => handleJoinTrip(viaje)}
              disabled={!viaje.activo || viaje.asientos_disponibles <= 0}
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card title="Listado de Viajes" className="card p-4 main-card" style={{ borderRadius: "12px" }}>
      <Toast ref={toast} position={isMobile ? "bottom-center" : "top-right"} />
      {renderFilters()}

      {loading ? (
        <div className="loading-container">
          <i className="pi pi-spin pi-spinner loading-icon"></i>
          <span>Cargando viajes...</span>
        </div>
      ) : filteredViajes.length > 0 ? (
        <>
          <div className="trip-grid">
            {filteredViajes
              .slice(first, first + rows)
              .map((viaje) => renderViajeCard(viaje))}
          </div>
          <Paginator
            first={first}
            rows={rows}
            totalRecords={filteredViajes.length}
            onPageChange={onPageChange}
            className="trip-paginator"
          />
        </>
      ) : (
        <div className="no-trips-message">
          <i className="pi pi-info-circle"></i>
          <span> No se encontraron viajes.</span>
          {Object.values(filters).some(Boolean) || globalFilterValue ? (
            <Button
              label="Limpiar filtros"
              icon="pi pi-filter-slash"
              className="p-button-text"
              onClick={clearFilter}
            />
          ) : null}
        </div>
      )}

      {renderLuggageDialog()}
    </Card>
  );
};
    
export default ViajesView;

