import React, { useEffect, useState, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const Chat = ({ viajeId, onClose }) => {
    const [mensaje, setMensaje] = useState("");
    const [mensajes, setMensajes] = useState([]);
    const [participantes, setParticipantes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const token = JSON.parse(localStorage.getItem("token"));
    const toast = useRef(null);
    const mensajesRef = useRef(null);

    useEffect(() => {
        obtenerMensajes();
        // Configurar intervalo para actualizar mensajes cada 10 segundos
        const interval = setInterval(obtenerMensajes, 10000);
        return () => clearInterval(interval);
    }, [viajeId]);

    // Función para hacer scroll al último mensaje
    useEffect(() => {
        if (mensajesRef.current) {
            mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
        }
    }, [mensajes]);

    // Obtener información del usuario actual
    const usuarioId = JSON.parse(localStorage.getItem("usuario"))?.id;

    const obtenerMensajes = async () => {
        try {
            // Obtener mensajes del chat
            const response = await fetch(`http://localhost:5000/chat/${viajeId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Error al obtener los mensajes");
            }
            
            const data = await response.json();
            setMensajes(data);
            setCargando(false);

            try {
                const participantesResponse = await fetch(`http://localhost:5000/viajes/${viajeId}/participantes`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                if (participantesResponse.ok) {
                    const participantesData = await participantesResponse.json();
                    setParticipantes(participantesData);
                }
            } catch (error) {
                console.error("Error al obtener participantes:", error);
            }
        } catch (error) {
            if (!cargando) { // Evitar mostrar error en la carga inicial
                toast.current.show({ 
                    severity: "error", 
                    summary: "Error", 
                    detail: "No se pudieron obtener los mensajes.", 
                    life: 3000 
                });
            }
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
                await obtenerMensajes(); // Recargar mensajes después de enviar uno nuevo
                setMensaje("");
            } else {
                throw new Error("Error al enviar el mensaje");
            }
        } catch (error) {
            toast.current.show({ 
                severity: "error", 
                summary: "Error", 
                detail: "No se pudo enviar el mensaje.", 
                life: 3000 
            });
        }
    };

    // Manejo de la tecla Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            enviarMensaje();
        }
    };

    // Formatear fecha de mensajes
    const formatFecha = (fechaString) => {
        const fecha = new Date(fechaString);
        return fecha.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Card className="p-4 w-full max-w-4xl">
            <Toast ref={toast} />
            <div className="flex flex-col md:flex-row gap-4">
                {/* Área de mensajes */}
                <div className="w-full md:w-3/4 p-2">
                    <h3 className="text-xl font-bold mb-2">Chat del viaje</h3>
                    <div 
                        ref={mensajesRef}
                        className="h-80 overflow-auto border p-3 rounded bg-gray-50"
                    >
                        {cargando ? (
                            <div className="flex justify-center items-center h-full">
                                <i className="pi pi-spin pi-spinner text-blue-500" style={{ fontSize: '2rem' }}></i>
                            </div>
                        ) : mensajes.length === 0 ? (
                            <p className="text-gray-500 text-center italic mt-8">
                                No hay mensajes aún. ¡Sé el primero en escribir!
                            </p>
                        ) : (
                            mensajes.map((msg) => (
                                <div 
                                    key={msg.id} 
                                    className={`mb-2 p-2 rounded max-w-[85%] ${
                                        msg.id_usuario === usuarioId 
                                            ? 'ml-auto bg-blue-100 text-blue-800' 
                                            : 'bg-gray-200'
                                    }`}
                                >
                                    <div className="font-bold">{msg.nombre_usuario || `Usuario ${msg.id_usuario}`}</div>
                                    <div>{msg.contenido}</div>
                                    <div className="text-xs text-gray-500 text-right">
                                        {formatFecha(msg.enviado_en)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input para escribir mensajes */}
                    <div className="mt-3 flex">
                        <InputText
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Escribe un mensaje..."
                            className="flex-1"
                        />
                        <Button 
                            label="Enviar" 
                            icon="pi pi-send" 
                            className="ml-2" 
                            onClick={enviarMensaje} 
                        />
                        <Button 
                            label="Cerrar" 
                            icon="pi pi-times" 
                            className="ml-2 p-button-outlined p-button-danger" 
                            onClick={onClose} 
                        />
                    </div>
                </div>

                {/* Lista de participantes */}
                <div className="w-full md:w-1/4 p-2 bg-gray-100 rounded">
                    <h3 className="text-lg font-bold mb-2">Participantes</h3>
                    {participantes.length === 0 ? (
                        <p className="text-gray-500 italic">Cargando participantes...</p>
                    ) : (
                        <ul>
                            {participantes.map((p) => (
                                <li key={p.id} className="p-2 border-b flex items-center">
                                    <i className="pi pi-user mr-2"></i>
                                    {p.nombre} {p.apellido}
                                    {p.esConductor && (
                                        <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                            Conductor
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default Chat;