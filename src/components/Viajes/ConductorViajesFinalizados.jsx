import React, { useState, useEffect, useRef } from "react";
import { DataScroller } from "primereact/datascroller"; // Importa DataScroller
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
const ViajesFinalizados = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tipoViaje, setTipoViaje] = useState("conductor");
    const toast = useRef(null);

    useEffect(() => {
        if (token) {
            fetchViajesCompletados();
        }
    }, [token, tipoViaje]);

    const fetchViajesCompletados = async () => {
        try {
            setLoading(true);
            const endpoint = tipoViaje === "conductor" 
                ? "http://localhost:5000/viajes/completados" 
                : "http://localhost:5000/viajes/pasajero/completados";
            
            const response = await fetch(endpoint, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (response.ok) {
                const data = await response.json();
                setViajes(data);
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

    const origenBodyTemplate = (rowData) => rowData.origen?.nombre || "No disponible";
    const destinoBodyTemplate = (rowData) => rowData.destino?.nombre || "No disponible";
    const precioBodyTemplate = (rowData) => rowData.precio ? `$${rowData.precio.toFixed(2)}` : "No disponible";

    return (
        <>
            <Card 
                title={`Viajes Finalizados Como ${tipoViaje === "conductor" ? "Conductor" : "Pasajero"}`} 
                className={`p-4 ${tipoViaje === "conductor" ? "bg-pasajero" : "bg-conductor"}`} 
                style={{ borderRadius: "12px" }}
            >
                <Toast ref={toast} />
                <div className="mb-4 text-center">
                    <Button 
                        label={tipoViaje === "conductor" ? "Ver como Pasajero" : "Ver como Conductor"}
                        icon={tipoViaje === "conductor" ? "pi pi-user" : "pi pi-car"}
                        onClick={() => setTipoViaje(tipoViaje === "conductor" ? "pasajero" : "conductor")}
                        className="p-button p-button-info"
                    />
                </div>
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
                    <DataScroller 
                        value={viajes} 
                        rows={10} 
                        inline 
                        loader={loading} 
                        loadingIcon="pi pi-spin pi-spinner" 
                        emptyMessage="No se encontraron viajes completados"
                        itemTemplate={(viaje) => (
                            <div className="p-2 border-round" style={{ marginBottom: "1rem" }}>
                                <div className="font-semibold">Origen: {origenBodyTemplate(viaje)}</div>
                                <div className="font-semibold">Destino: {destinoBodyTemplate(viaje)}</div>
                                <div>Hora de Inicio: {dateBodyTemplate(viaje, 'hora_inicio_real')}</div>
                                <div>Precio: {precioBodyTemplate(viaje)}</div>
                                <div className="font-semibold" label="Conductor"
                                >Conductor: {viaje.conductor?.nombre} {viaje.conductor?.apellido}</div>
                            </div>
                        )}
                    />
                )}
            </Card>
        </>
    );
};

export default ViajesFinalizados;
