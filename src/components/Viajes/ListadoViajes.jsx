import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';

const ViajesView = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [showLuggageDialog, setShowLuggageDialog] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedLuggage, setSelectedLuggage] = useState(null);
  const [luggageTypes, setLuggageTypes] = useState([]);
  const toast = useRef(null);

  useEffect(() => {
    initFilters();
    fetchViajes();
    fetchLuggageTypes();
  }, [token]);

  const fetchLuggageTypes = async () => {
    if (!token) return;

    try {
      const response = await fetch("http://localhost:5000/equipajes", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLuggageTypes(data.map(type => ({
          label: type.categoria,
          value: type.id
        })));
      } else {
        console.error("Error al obtener tipos de equipaje");
      }
    } catch (error) {
      console.error("Error en la solicitud de tipos de equipaje:", error);
    }
  };

  const fetchViajes = async () => {
    if (!token) {
      console.error("Token no encontrado");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/viajes", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setViajes(data);
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
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      'origen.nombre': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      'destino.nombre': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      fecha_salida: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
    });
    setGlobalFilterValue('');
  };

  const clearFilter = () => {
    initFilters();
  };

  const handleJoinTrip = (tripData) => {
    if (!token) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe iniciar sesión para unirse a un viaje',
        life: 3000
      });
      return;
    }
    setSelectedTrip(tripData);
    setShowLuggageDialog(true);
  };

  const handleAddPassenger = async () => {
    if (!selectedTrip || !selectedLuggage) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor seleccione un tipo de equipaje',
        life: 3000
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/viajes/${selectedTrip.id}/pasajeros`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          equipaje_id: selectedLuggage
        })
      });

      const data = await response.json();

      if (response.ok) {
        setViajes(prevViajes => 
          prevViajes.map(viaje => 
            viaje.id === selectedTrip.id 
              ? { ...viaje, asientos_disponibles: viaje.asientos_disponibles - 1 }
              : viaje
          )
        );

        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Te has unido al viaje exitosamente',
          life: 3000
        });
        
        handleDialogClose();
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: data.error || 'Error al unirse al viaje',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Error al unirse al viaje:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error de conexión al intentar unirse al viaje',
        life: 3000
      });
    }
  };

  const handleDialogClose = () => {
    setShowLuggageDialog(false);
    setSelectedTrip(null);
    setSelectedLuggage(null);
  };

  const actionTemplate = (rowData) => {
    return (
      <Button
        label="Unirse al viaje"
        icon="pi pi-check"
        severity="success"
        className="p-button-raised"
        onClick={() => handleJoinTrip(rowData)}
        disabled={!rowData.activo || rowData.asientos_disponibles <= 0}
        style={{
          backgroundColor: '#22c55e',
          border: 'none',
          color: 'white'
        }}
      />
    );
  };

  const observacionesTemplate = (rowData) => {
    return rowData.observaciones || "Ninguna";
  };

  const dateBodyTemplate = (rowData) => {
    return new Date(rowData.fecha_salida).toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, 
    });
  };
  const dateFilterTemplate = (options) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="dd/mm/yy"
        placeholder="dd/mm/yyyy"
        mask="99/99/9999"
        className="p-calendar-custom"
      />
    );
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        <h2 className="text-2xl font-bold m-0">Listado de Viajes</h2>
        <div className="flex align-items-center gap-3">
          <Button 
            type="button" 
            icon="pi pi-filter-slash" 
            label="Limpiar filtros"
            severity="info"
            className="p-button-raised"
            onClick={clearFilter}
            style={{
              backgroundColor: '#3b82f6',
              border: 'none',
              color: 'white'
            }}
          />
        </div>
      </div>
    );
  };

  const renderLuggageDialog = () => {
    const dialogFooter = (
      <div>
        <Button 
          label="Cancelar" 
          icon="pi pi-times" 
          onClick={handleDialogClose} 
          className="p-button-text"
        />
        <Button 
          label="Confirmar" 
          icon="pi pi-check" 
          onClick={handleAddPassenger} 
          autoFocus 
          severity="success"
          style={{
            backgroundColor: '#22c55e',
            border: 'none',
            color: 'white'
          }}
        />
      </div>
    );

    return (
      <Dialog 
        visible={showLuggageDialog} 
        style={{ width: '450px' }} 
        header="Seleccionar Equipaje" 
        modal 
        className="p-fluid" 
        footer={dialogFooter} 
        onHide={handleDialogClose}
      >
        <div className="field">
          <label htmlFor="luggage" className="font-bold">Tipo de Equipaje</label>
          <Dropdown
            id="luggage"
            value={selectedLuggage}
            options={luggageTypes}
            onChange={(e) => setSelectedLuggage(e.value)}
            placeholder="Seleccione un tipo de equipaje"
            className="w-full md:w-14rem"
          />
        </div>
      </Dialog>
    );
  };

  return (
    <Card title="Listado de viajes" className="p-4" style={{ borderRadius: "12px" }}>
      <Toast ref={toast} />
        {loading ? (
          <div className="text-center p-4">
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: '#3b82f6' }}></i>
            <div className="mt-2">Cargando viajes...</div>
          </div>
        ) : viajes.length === 0 ? (
          <div className="text-center p-4">
            <i className="pi pi-info-circle" style={{ fontSize: "2rem", color: "#64748b" }}></i>
            <p className="mt-2 text-gray-600">No hay viajes disponibles. Se el primero en ofrecer! </p>
          </div>  
        ) : (
          <>
            <DataTable
              value={viajes}
              paginator
              rows={10}
              dataKey="id"
              filters={filters}
              globalFilterFields={['origen.nombre', 'destino.nombre']}
              header={renderHeader}
              emptyMessage="No hay viajes disponibles."
              showGridlines
              stripedRows
              className="p-datatable-custom"
              paginatorClassName="custom-paginator"
              style={{
                '--primary-color': '#3b82f6',
                '--primary-light-color': '#93c5fd'
              }}
            >
              <Column 
                field="origen.nombre" 
                header="Origen" 
                filter 
                filterPlaceholder="Buscar por origen"
                sortable
                className="font-semibold"
              />
              <Column 
                field="destino.nombre" 
                header="Destino" 
                filter 
                filterPlaceholder="Buscar por destino"
                sortable
                className="font-semibold"
              />
              <Column
                field="fecha_salida"
                header="Fecha"
                dataType="date"
                body={dateBodyTemplate}
                filter
                filterElement={dateFilterTemplate}
                sortable
                className="font-semibold"
              />
              <Column
                field="conductor"
                header="Conductor"
                body={(rowData) =>
                  `${rowData.conductor.nombre} ${rowData.conductor.apellido}`
                }
                className="font-semibold"
              />
              <Column 
                field="precio" 
                header="Precio" 
                body={(rowData) => `$${rowData.precio}`} 
                sortable 
                className="font-semibold"
              />
              <Column
                field="asientos_disponibles"
                header="Asientos Disponibles"
                sortable
                className="font-semibold"
              />
              <Column
                field="observaciones"
                header="Observaciones"
                body={observacionesTemplate}
                className="font-semibold"
              />
              <Column body={actionTemplate} header="Acciones" />
            </DataTable>
            {renderLuggageDialog()}
          </>
        )}
    </Card>
  );
};

export default ViajesView;