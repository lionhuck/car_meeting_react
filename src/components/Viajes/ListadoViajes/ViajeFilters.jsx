import { useState } from "react"
import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { InputText } from "primereact/inputtext"

const ViajeFilters = ({ filters, setFilters, clearFilter }) => {
  const [showFilters, setShowFilters] = useState(false)
  const isMobile = window.innerWidth <= 768

  return (
    <div className="filters-container">
      <div className="filters-header">
        <Button
          icon={showFilters ? "pi pi-times" : "pi pi-filter"}
          className="p-button-rounded p-button-text"
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
              className="p-button-info clear-filter-btn w-full"
              label={isMobile ? "Limpiar" : "Limpiar filtros"}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ViajeFilters