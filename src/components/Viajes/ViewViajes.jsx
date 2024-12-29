import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
const ViajesView = ({ onAddPassenger }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  useEffect(() => {
    initFilters();
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

    fetchViajes();
  }, [token]);

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


  const actionTemplate = (rowData) => {
    return (
      <Button
        label="Unirse al viaje"
        icon="pi pi-check"
        severity="success"
        className="p-button-raised"
        onClick={() => onAddPassenger(rowData.id)}
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
    return new Date(rowData.fecha_salida).toLocaleString();
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

  return (
    <div className="card p-4" style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
      {loading ? (
        <div className="text-center p-4">
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: '#3b82f6' }}></i>
          <div className="mt-2">Cargando viajes...</div>
        </div>
      ) : viajes.length === 0 ? (
        <p className="text-center text-gray-600">No hay viajes disponibles en este momento.</p>
      ) : (
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
      )}
    </div>
  );
};

export default ViajesView;