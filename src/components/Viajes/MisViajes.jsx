import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";

const ViajesPasajero = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);

    useEffect(() => {
        fetchViajesPasajero();
    }, [token]);

    const fetchViajesPasajero = async () => {
        if (!token) {
            console.error("Token no encontrado");
            setLoading(false);
            return;
        }

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
                console.error("Error al obtener los viajes");
            }
        } catch (error) {
            console.error("Error en la solicitud de viajes:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-4" style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <Toast ref={toast} />
            {loading ? (
                <div className="text-center p-4">
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: '#3b82f6' }}></i>
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
                    style={{ '--primary-color': '#3b82f6', '--primary-light-color': '#93c5fd' }}
                >
                    <Column field="origen.nombre" header="Origen" sortable className="font-semibold" />
                    <Column field="destino.nombre" header="Destino" sortable className="font-semibold" />
                    <Column field="fecha_salida" header="Fecha" sortable className="font-semibold" />
                    <Column field="conductor.nombre" header="Conductor" className="font-semibold" />
                    <Column field="precio" header="Precio" body={(rowData) => `$${rowData.precio}`} sortable className="font-semibold" />
                    <Column field="observaciones" header="Observaciones" className="font-semibold" />
                </DataTable>
            )}
        </div>
    );
};

export default ViajesPasajero;
