import React, { useEffect, useState, useRef, useCallback } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import './Chat.css'; // Import the new CSS file

const API_URL = import.meta.env.VITE_API_URL;

const Chat = ({ viajeId, onClose }) => {
    const [mensaje, setMensaje] = useState("");
    const [mensajes, setMensajes] = useState([]);
    const [participantes, setParticipantes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const token = JSON.parse(localStorage.getItem("token"));
    const toast = useRef(null);
    const mensajesRef = useRef(null);

    // Network status tracking
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Fetch messages on component mount and at intervals
    useEffect(() => {
        obtenerMensajes();
        // Configurar intervalo para actualizar mensajes cada 10 segundos
        const interval = setInterval(obtenerMensajes, 10000);
        return () => clearInterval(interval);
    }, [viajeId]);

    // Auto-scroll to latest message
    useEffect(() => {
        if (mensajesRef.current) {
            mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
        }
    }, [mensajes]);

    // Get current user ID
    const usuarioId = JSON.parse(localStorage.getItem("usuario"))?.id;

    // Fetch messages and participants
    const obtenerMensajes = async () => {
        if (!isOnline) return;

        try {
            const response = await fetch(`${API_URL}/chat/${viajeId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Error al obtener los mensajes");
            }
            
            const data = await response.json();
            setMensajes(data);
            setCargando(false);

            try {
                const participantesResponse = await fetch(`${API_URL}/viajes/${viajeId}/participantes`, {
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
            if (!cargando) {
                toast.current.show({ 
                    severity: "error", 
                    summary: "Error", 
                    detail: "No se pudieron obtener los mensajes.", 
                    life: 3000 
                });
            }
        }
    };

    // Send message
    const enviarMensaje = async () => {
        if (!mensaje.trim() || !isOnline) {
            if (!isOnline) {
                toast.current.show({
                    severity: "warn",
                    summary: "Sin conexión",
                    detail: "Verifica tu conexión a internet.",
                    life: 3000
                });
            }
            return;
        }

        try {
            const response = await fetch(`${API_URL}/chat/${viajeId}/mensaje`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ contenido: mensaje }),
            });

            if (response.ok) {
                await obtenerMensajes();
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

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensaje();
        }
    };

    // Format message timestamp
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
        <Card className="chat-container">
            <Toast ref={toast} />
            <div className="chat-wrapper">
                {/* Messages Area */}
                <div className="chat-messages-section">
                    <h3 className="chat-title">Chat del viaje</h3>
                    <div 
                        ref={mensajesRef}
                        className="chat-messages-area"
                    >
                        {cargando ? (
                            <div className="chat-loading">
                                <i className="pi pi-spin pi-spinner text-blue-500"></i>
                            </div>
                        ) : mensajes.length === 0 ? (
                            <p className="chat-no-messages">
                                No hay mensajes aún. ¡Sé el primero en escribir!
                            </p>
                        ) : (
                            mensajes.map((msg) => (
                                <div 
                                    key={msg.id} 
                                    className={`chat-message ${
                                        msg.id_usuario === usuarioId 
                                            ? 'chat-message-sent' 
                                            : 'chat-message-received'
                                    }`}
                                >
                                    <div className="chat-message-sender">{msg.nombre_usuario || `Usuario ${msg.id_usuario}`}</div>
                                    <div className="chat-message-content">{msg.contenido}</div>
                                    <div className="chat-message-timestamp">
                                        {formatFecha(msg.enviado_en)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Message Input */}
                    <div className="chat-input-section">
                        <InputText
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Escribe un mensaje..."
                            className="chat-input"
                            multiline
                        />
                        
                        <div className="chat-actions">
                            <Button 
                                icon="pi pi-send" 
                                className="chat-send-button" 
                                onClick={enviarMensaje}
                                disabled={!isOnline}
                            />
                            <Button 
                                icon="pi pi-times" 
                                className="chat-close-button" 
                                onClick={onClose} 
                            />
                        </div>
                    </div>
                </div>

                {/* Participants Area */}
                <div className="chat-participants-section">
                    <h3 className="chat-participants-title">Participantes</h3>
                    {participantes.length === 0 ? (
                        <p className="chat-participants-loading">Cargando participantes...</p>
                    ) : (
                        <ul className="chat-participants-list">
                            {participantes.map((p) => (
                                <li key={p.id} className="chat-participant-item">
                                    <i className="pi pi-user"></i>
                                    {p.nombre} {p.apellido}
                                    {p.esConductor && (
                                        <span className="chat-participant-driver-badge">
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