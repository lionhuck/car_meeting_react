import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const ViajesConductor = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        if (token) {
            fetchViajesConductor();
        }
    }, [token]);

    const fetchViajesConductor = async () => {
        try {
            const response = await fetch("http://localhost:5000/viajes/conductor", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setViajes(data);
            } else {
                throw new Error("Error al obtener los viajes");
            }
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: error.message, life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const confirmCancelTrip = (trip) => {
        setSelectedTrip(trip);
        setShowDialog(true);
    };

    const handleCancelTrip = async () => {
        if (!selectedTrip) return;
        try {
            const response = await fetch(`http://localhost:5000/viajes/${selectedTrip.id}/cancelar`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setViajes(viajes.filter((viaje) => viaje.id !== selectedTrip.id));
                toast.current.show({ severity: "success", summary: "Éxito", detail: "Viaje cancelado correctamente", life: 3000 });
            } else {
                throw new Error("No se pudo cancelar el viaje");
            }
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: error.message, life: 3000 });
        } finally {
            setShowDialog(false);
            setSelectedTrip(null);
        }
    };

    const formatFechaSalida = (fecha) => {
        const date = new Date(fecha);
        return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    };

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <Dialog 
                visible={showDialog} 
                onHide={() => setShowDialog(false)} 
                header="Confirmar cancelación" 
                footer={
                    <div>
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowDialog(false)} className="p-button-text" />
                        <Button label="Confirmar" icon="pi pi-check" onClick={handleCancelTrip} className="p-button-danger" />
                    </div>
                }
            >
                <p>¿Estás seguro de que deseas cancelar este viaje?</p>
            </Dialog>

            <h2 className="text-center text-2xl font-semibold mb-4">Mis Viajes Ofrecidos</h2>

            {loading ? (
                <div className="text-center p-4">
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem", color: "#3b82f6" }}></i>
                    <div className="mt-2">Cargando viajes...</div>
                </div>
            ) : viajes.length === 0 ? (
                <p className="text-center text-gray-600">No has ofrecido ningún viaje.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {viajes.map((viaje) => (
                        <div key={viaje.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                            <h3 className="text-lg font-semibold text-blue-600">{viaje.origen.nombre} → {viaje.destino.nombre}</h3>
                            <p className="text-gray-700"><strong>Fecha:</strong> {formatFechaSalida(viaje.fecha_salida)}</p>
                            <p className="text-gray-700"><strong>Precio:</strong> ${viaje.precio}</p>
                            <p className="text-gray-700"><strong>Plazas disponibles:</strong> {viaje.plazas_disponibles}</p>
                            {viaje.observaciones && <p className="text-gray-700"><strong>Observaciones:</strong> {viaje.observaciones}</p>}
                            <Button 
                                label="Cancelar viaje"
                                icon="pi pi-times"
                                className="p-button-danger mt-3"
                                onClick={() => confirmCancelTrip(viaje)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViajesConductor;
