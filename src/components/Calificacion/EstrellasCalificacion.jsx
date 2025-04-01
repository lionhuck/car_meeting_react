// EstrellasCalificacion.jsx (versión optimizada)
import React, { useState, useEffect } from "react";
import { Rating } from "primereact/rating";
import { Badge } from "primereact/badge";

const EstrellasCalificacion = ({ usuarioId, token, tipo = "conductor" }) => {
  const [stats, setStats] = useState({ promedio: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/usuarios/${usuarioId}/estadisticas`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    if (usuarioId && token) {
      fetchEstadisticas();
    }
  }, [usuarioId, token]);

  if (loading) {
    return <span>Cargando calificaciones...</span>;
  }

  return (
    <div className="flex align-items-center">
      <Rating value={stats.promedio} readOnly cancel={false} stars={5} />
      <Badge value={stats.total} severity="info" className="ml-2" />
    </div>
  );
};

export default EstrellasCalificacion;