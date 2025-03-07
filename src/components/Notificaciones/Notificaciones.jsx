import React, { useState } from "react";
import useCalificacionPendiente from "../../Hooks/CalificacionPendiente";

const NotificacionCalificacion = ({ viajeId }) => {
  const { pendiente, setPendiente } = useCalificacionPendiente(viajeId);
  const [calificacion, setCalificacion] = useState(0);

  const enviarCalificacion = () => {
    fetch(`http://localhost:5000/viajes/${viajeId}/calificar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ calificacion }),
    })
      .then((res) => res.json())
      .then(() => {
        setPendiente(false);
        localStorage.setItem(`calificacion_${viajeId}`, "true"); // Evita mostrarla nuevamente
      })
      .catch((error) => console.error("Error enviando calificación:", error));
  };

  if (!pendiente) return null; // Si no hay calificación pendiente, no mostrar nada

  return (
    <div className="notificacion">
      <p>Califica tu último viaje:</p>
      <select value={calificacion} onChange={(e) => setCalificacion(e.target.value)}>
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>{num} estrellas</option>
        ))}
      </select>
      <button onClick={enviarCalificacion}>Enviar</button>
    </div>
  );
};

export default NotificacionCalificacion;
