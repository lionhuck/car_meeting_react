import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import Chat from "../Chat/Chat"; // Importar el componente Chat

const ViajesConductor = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [activeChatViajeId, setActiveChatViajeId] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        if (token) {
            fetchViajesConductor();
        }
    }, [token]);

    const fetchViajesConductor = async () => {
        try {
            const response = await fetch("http://localhost:5000/viajes/disponibles", {
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

    const confirmStartTrip = (trip) => {
        setSelectedTrip(trip);
        setShowDialog(true);
    };
    const handleStartTrip = async () => {
        if (!selectedTrip) return;
        try {
            const response = await fetch(`http://localhost:5000/viajes/${selectedTrip.id}/iniciar`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`},
            });
            
            if (response.ok) {
                setViajes(viajes.filter((viaje) => viaje.id !== selectedTrip.id));
                toast.current.show({ severity: "success", summary: "Éxito", detail: "Viaje iniciado", life: 3000 });
            } else {
                throw new Error("No se pudo iniciar el viaje");
            }
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: error.message, life: 3000 });
        }
        finally {
            setShowDialog(false);
            setSelectedTrip(null);
        }
    }
    
        const confirmDeleteTrip = (trip) => {
            setSelectedTrip(trip);
            setShowDialog(true);
        };
    
        const handleDeleteTrip = async () => {
        if (!selectedTrip) return;
        try {
            const response = await fetch(`http://localhost:5000/viajes/${selectedTrip.id}/eliminar`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                setViajes(viajes.filter((viaje) => viaje.id !== selectedTrip.id));
                toast.current.show({ severity: "success", summary: "Éxito", detail: "Viaje eliminado", life: 3000 });
            } else {
                throw new Error("No se pudo eliminar el viaje");
            }
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: error.message, life: 3000 });
        } finally {
            setShowDialog(false);
            setSelectedTrip(null);
        }
    };

    const handleOpenChat = (viajeId) => {
        setActiveChatViajeId(viajeId);
        setShowChat(true);
    };

    const handleCloseChat = () => {
        setShowChat(false);
        setActiveChatViajeId(null);
    };

    const actionTemplate = (rowData) => (
        <div className="flex gap-2">
            <Button 
                label="Eliminar" 
                icon="pi pi-trash" 
                className="p-button-danger" 
                onClick={() => confirmDeleteTrip(rowData)} 
            />
            <Button 
                label="Chat" 
                icon="pi pi-comments" 
                className="p-button-secondary" 
                onClick={() => handleOpenChat(rowData.id)} 
            />
            <Button
                label="Comenzar Viaje"
                icon="pi pi-start"
                className="p-button-warning"
                onClick={() => { confirmStartTrip(rowData) }}
            />
        </div>
    );

    const dateBodyTemplate = (rowData) => new Date(rowData.fecha_salida).toLocaleString("es-ES", {
        year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false,
    });

    return (
        <>
            <Card title="Viajes Ofrecidos" className="card p-4" style={{ borderRadius: "12px" }}>
                <Toast ref={toast} />
                <Dialog 
                    visible={showDialog} 
                    onHide={() => setShowDialog(false)} 
                    header="Confirmar eliminación" 
                    footer={
                        <div>
                            <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowDialog(false)} className="p-button-text" />
                            <Button label="Confirmar" icon="pi pi-check" onClick={handleDeleteTrip} className="p-button-danger" />
                        </div>
                    }
                >
                    <p>¿Estás seguro de que deseas eliminar este viaje?</p>
                </Dialog>

                <Dialog 
                    visible={showDialog} 
                    onHide={() => setShowDialog(false)} 
                    header="Comenzar Viaje" 
                    footer={
                        <div>
                            <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowDialog(false)} className="p-button-text" />
                            <Button label="Confirmar" icon="pi pi-check" onClick={handleStartTrip} className="p-button-succes" />
                        </div>
                    }
                >
                    <p>¿Estás seguro de que deseas comenzar este viaje?</p>
                </Dialog>



                
                {loading ? (
                    <div className="text-center p-4">
                        <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem", color: "#3b82f6" }}></i>
                        <div className="mt-2">Cargando viajes...</div>
                    </div>
                ) : viajes.length === 0 ? (
                    <div className="text-center p-4">
                        <i className="pi pi-info-circle" style={{ fontSize: "2rem", color: "#64748b" }}></i>
                        <p className="text-center text-gray-600">No has creado ningún viaje.</p>
                    </div>
                ) : (
                    <DataTable value={viajes} paginator rows={10} dataKey="id" showGridlines stripedRows>
                        <Column field="origen.nombre" header="Origen" sortable className="font-semibold" />
                        <Column field="destino.nombre" header="Destino" sortable className="font-semibold" />
                        <Column field="fecha_salida" header="Fecha" body={dateBodyTemplate} sortable className="font-semibold" />
                        <Column field="precio" header="Precio" body={(rowData) => `$${rowData.precio}`} sortable className="font-semibold" />
                        <Column field="observaciones" header="Observaciones" className="font-semibold" />
                        <Column header="Acciones" body={actionTemplate} className="font-semibold" />
                    </DataTable>
                )}
            </Card>
            
            {/* Chat Modal */}
            <Dialog
                visible={showChat}
                onHide={handleCloseChat}
                header="Chat del Viaje"
                style={{ width: '80vw', maxWidth: '1000px' }}
                maximizable
                modal
                className="p-fluid"
            >
                {activeChatViajeId && (
                    <Chat 
                        viajeId={activeChatViajeId} 
                        onClose={handleCloseChat} 
                    />
                )}
            </Dialog>
        </>
    );
};

export default ViajesConductor;