import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const ViajesPasajero = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        if (token) {
            fetchViajesPasajero();
        }
    }, [token]);

    const fetchViajesPasajero = async () => {
        try {
            const response = await fetch("http://localhost:5000/viajes/pasajeros", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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

    const confirmUnjoinTrip = (trip) => {
        setSelectedTrip(trip);
        setShowDialog(true);
    };

    const handleUnjoinTrip = async () => {
        if (!selectedTrip) return;
        try {
            const response = await fetch(`http://localhost:5000/viajes/${selectedTrip.id}/eliminar/pasajero`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setViajes(viajes.filter((viaje) => viaje.id !== selectedTrip.id));
                toast.current.show({ severity: "success", summary: "Éxito", detail: "Saliste del viaje exitosamente", life: 3000 });
            } else {
                throw new Error("No se pudo salir del viaje");
            }
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: error.message, life: 3000 });
        } finally {
            setShowDialog(false);
            setSelectedTrip(null);
        }
    };

    const actionTemplate = (rowData) => (
        <Button
            label="Salir del viaje"
            icon="pi pi-times"
            className="p-button-danger"
            onClick={() => confirmUnjoinTrip(rowData)}
        />
    );

    return (
        <div className="card p-4" style={{ background: "white", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
            <Toast ref={toast} />
            <Dialog 
                visible={showDialog} 
                onHide={() => setShowDialog(false)} 
                header="Confirmar salida" 
                footer={
                    <div>
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowDialog(false)} className="p-button-text" />
                        <Button label="Confirmar" icon="pi pi-check" onClick={handleUnjoinTrip} className="p-button-danger" />
                    </div>
                }
            >
                <p>¿Estás seguro de que deseas salir de este viaje?</p>
            </Dialog>
            {loading ? (
                <div className="text-center p-4">
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem", color: "#3b82f6" }}></i>
                    <div className="mt-2">Cargando viajes...</div>
                </div>
            ) : viajes.length === 0 ? (
                <p className="text-center text-gray-600">No has sido pasajero en ningún viaje.</p>
            ) : (
                <DataTable
                    value={viajes}
                    paginator
                    rows={10}
                    dataKey="id"
                    emptyMessage="No hay viajes disponibles."
                    showGridlines
                    stripedRows
                    className="p-datatable-custom"
                    paginatorClassName="custom-paginator"
                >
                    <Column field="origen.nombre" header="Origen" sortable className="font-semibold" />
                    <Column field="destino.nombre" header="Destino" sortable className="font-semibold" />
                    <Column field="fecha_salida" header="Fecha" sortable className="font-semibold" />
                    <Column field="conductor.nombre" header="Conductor" className="font-semibold" />
                    <Column field="precio" header="Precio" body={(rowData) => `$${rowData.precio}`} sortable className="font-semibold" />
                    <Column field="observaciones" header="Observaciones" className="font-semibold" />
                    <Column header="Acciones" body={actionTemplate} className="font-semibold" />
                </DataTable>
            )}
        </div>
    );
};

export default ViajesPasajero;
