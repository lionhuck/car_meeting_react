import { useEffect, useState } from "react";

const useCalificacionPendiente = (viajeId) => {
  const [pendiente, setPendiente] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const revisado = localStorage.getItem(`calificacion_${viajeId}`);
    
    if (revisado) return; // Si ya se revisó este viaje, no hacer la petición

    fetch(`http://localhost:5000/viajes/${viajeId}/calificacion-pendiente`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.puede_calificar) {
          setPendiente(true);
        }
        setMensaje(data.mensaje);
      })
      .catch((error) => console.error("Error verificando calificación:", error));
  }, [viajeId]);

  return { pendiente, mensaje, setPendiente };
};

export default useCalificacionPendiente;
