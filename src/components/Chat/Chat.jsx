import React, { useEffect, useState, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const Chat = ({ viajeId, onClose }) => {
    const [mensaje, setMensaje] = useState("");
    const [mensajes, setMensajes] = useState([]);
    const [participantes, setParticipantes] = useState([]);
    const token = JSON.parse(localStorage.getItem("token"));
    const toast = useRef(null);

    useEffect(() => {
        obtenerMensajes();
    }, [viajeId]); // Se ejecuta cada vez que cambia el viajeId

    const obtenerMensajes = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/chat/${viajeId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setMensajes(data.mensajes);
                setParticipantes(data.participantes);
            } else {
                throw new Error("Error al obtener los mensajes");
            }
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: "No se pudieron obtener los mensajes.", life: 3000 });
        }
    };

    const enviarMensaje = async () => {
        if (!mensaje.trim()) return;

        try {
            const response = await fetch(`http://localhost:5000/chat/${viajeId}/mensaje`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ contenido: mensaje }),
            });

            if (response.ok) {
                obtenerMensajes(); // Recargar mensajes después de enviar uno nuevo
                setMensaje("");
            } else {
                throw new Error("Error al enviar el mensaje");
            }
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo enviar el mensaje.", life: 3000 });
        }
    };

    return (
        <Card className="p-4">
            <Toast ref={toast} />
            <div className="flex gap-4">
                {/* Lista de participantes */}
                <div className="w-1/4 p-2 bg-gray-100 rounded">
                    <h3>Participantes</h3>
                    <ul>
                        {participantes.map((p) => (
                            <li key={p.id} className="p-2 border-b">{p.nombre}</li>
                        ))}
                    </ul>
                </div>

                {/* Área de mensajes */}
                <div className="w-3/4 p-2">
                    <div className="h-80 overflow-auto border p-2 rounded">
                        {mensajes.map((msg, index) => (
                            <p key={index}>
                                <strong>{msg.nombre}:</strong> {msg.contenido}
                            </p>
                        ))}
                    </div>

                    {/* Input para escribir mensajes */}
                    <div className="mt-2 flex">
                        <InputText
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                            placeholder="Escribe un mensaje..."
                            className="flex-1"
                        />
                        <Button label="Enviar" icon="pi pi-send" className="ml-2" onClick={enviarMensaje} />
                        <Button label="Cerrar" icon="pi pi-times" className="ml-2 p-button-danger" onClick={onClose} />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default Chat;
