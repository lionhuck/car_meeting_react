import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";

const ViajesEnCursoPasajero = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [finalizingTrip, setFinalizingTrip] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        if (token) {
            fetchViajesEnCurso();
        }
    }, [token]);

    const fetchViajesEnCurso = async () => {
        try {
            const response = await fetch("http://localhost:5000/viajes/pasajero/en-curso", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (response.ok) {
                const data = await response.json();
                setViajes(data);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al obtener los viajes en curso");
            }
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: error.message, life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const dateBodyTemplate = (rowData) => {
        if (!rowData.hora_inicio_real) return "-";
        const date = new Date(rowData.hora_inicio_real);
        return date.toLocaleString("es-ES", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const localidadTemplate = (rowData, field) => {
        const localidad = rowData[field];
        return localidad ? localidad.nombre : "-";
    };

    return (
        <Card title="Viajes en curso" className="p-4" style={{ borderRadius: "12px" }}>
            <Toast ref={toast} />
            {loading ? (
                <div className="text-center p-4">
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem", color: "#3b82f6" }}></i>
                    <div className="mt-2">Cargando viajes en curso...</div>
                </div>
            ) : viajes.length === 0 ? (
                <div className="text-center p-4">
                    <i className="pi pi-info-circle" style={{ fontSize: "2rem", color: "#64748b" }}></i>
                    <p className="mt-2 text-gray-600">No tienes viajes en curso.</p>
                </div>
            ) : (
                <DataTable 
                    value={viajes} 
                    paginator 
                    rows={10} 
                    dataKey="id" 
                    showGridlines 
                    stripedRows  
                    rowHover
                    responsiveLayout="scroll"
                    className="p-datatable-sm"
                >
                    <Column 
                        field="origen" 
                        header="Origen" 
                        body={(rowData) => localidadTemplate(rowData, 'origen')} 
                        sortable 
                        className="font-semibold" 
                    />
                    <Column 
                        field="destino" 
                        header="Destino" 
                        body={(rowData) => localidadTemplate(rowData, 'destino')} 
                        sortable 
                        className="font-semibold" 
                    />
                    <Column 
                        field="hora_inicio_real" 
                        header="Hora de Inicio" 
                        body={dateBodyTemplate} 
                        sortable 
                        className="font-semibold" 
                    />z
                </DataTable>
            )}
        </Card>
    );
};      
export default ViajesEnCursoPasajero;