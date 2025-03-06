import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";

const ViajesFinalizadosConductor = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);

    useEffect(() => {
        if (token) {
            fetchViajesCompletados();
        }
    }, [token]);

    const fetchViajesCompletados = async () => {
        try {
            const response = await fetch("http://localhost:5000/viajes/completados", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (response.ok) {
                const data = await response.json();
                setViajes(data);
                console.log("Viajes completados:", data);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al obtener los viajes completados");
            }
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: error.message, life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const dateBodyTemplate = (rowData, field) => {
        try {
            return new Date(rowData[field]).toLocaleString("es-ES", {
                year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false,
            });
        } catch (e) {
            return "Fecha no disponible";
        }
    };

    const origenBodyTemplate = (rowData) => {
        return rowData.origen?.nombre || "No disponible";
    };

    const destinoBodyTemplate = (rowData) => {
        return rowData.destino?.nombre || "No disponible";
    };

    const duracionBodyTemplate = (rowData) => {
        const duracionSegundos = rowData.duracion_viaje;
        if (!duracionSegundos && duracionSegundos !== 0) return "No disponible";
        
        // Convertir segundos a formato horas:minutos
        const horas = Math.floor(duracionSegundos / 3600);
        const minutos = Math.floor((duracionSegundos % 3600) / 60);
        
        return `${horas}h ${minutos}m`;
    };

    const precioBodyTemplate = (rowData) => {
        if (!rowData.precio) return "No disponible";
        return `$${rowData.precio.toFixed(2)}`;
    };

    const asientosBodyTemplate = (rowData) => {
        return (
            <Badge value={rowData.asientos_disponibles} 
                   severity={rowData.asientos_disponibles > 0 ? "success" : "danger"} />
        );
    };

    return (
        <>
            <Card title="Viajes Finalizados" className="p-4" style={{ borderRadius: "12px" }}>
                <Toast ref={toast} />
                
                {loading ? (
                    <div className="text-center p-4">
                        <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem", color: "#3b82f6" }}></i>
                        <div className="mt-2">Cargando viajes completados...</div>
                    </div>
                ) : viajes.length === 0 ? (
                    <div className="text-center p-4">
                        <i className="pi pi-info-circle" style={{ fontSize: "2rem", color: "#64748b" }}></i>
                        <p className="mt-2 text-gray-600">No tienes viajes completados.</p>
                    </div>
                ) : (
                    <DataTable 
                        value={viajes} 
                        paginator 
                        rows={10} 
                        dataKey="id" 
                        showGridlines 
                        stripedRows
                        emptyMessage="No se encontraron viajes completados"
                        rowHover
                        responsiveLayout="scroll"
                        className="p-datatable-sm"
                    >
                        <Column field="origen" header="Origen" body={origenBodyTemplate} sortable className="font-semibold" />
                        <Column field="destino" header="Destino" body={destinoBodyTemplate} sortable className="font-semibold" />
                        <Column field="fecha_salida" header="Fecha de Salida" body={(rowData) => dateBodyTemplate(rowData, 'fecha_salida')} sortable />
                        <Column field="hora_inicio_real" header="Hora de Inicio" body={(rowData) => dateBodyTemplate(rowData, 'hora_inicio_real')} sortable />
                        <Column field="hora_de_llegada" header="Hora de Llegada" body={(rowData) => dateBodyTemplate(rowData, 'hora_de_llegada')} sortable />
                        <Column field="duracion_viaje" header="Duración" body={duracionBodyTemplate} sortable />
                        <Column field="precio" header="Precio" body={precioBodyTemplate} sortable />
                        <Column field="asientos_disponibles" header="Asientos" body={asientosBodyTemplate} sortable />
                    </DataTable>
                )}
            </Card>
        </>
    );
};

export default ViajesFinalizadosConductor;