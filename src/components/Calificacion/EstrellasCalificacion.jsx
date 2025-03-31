import React, { useState, useEffect } from "react";
import { Rating } from "primereact/rating";

const EstrellasCalificacion = ({ usuarioId, token, tipo = "conductor" }) => {
  const [promedio, setPromedio] = useState(0);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (usuarioId) {
      obtenerEstadisticas();
    }
  }, [usuarioId]);

  const obtenerEstadisticas = async () => {
    try {
      setCargando(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/usuarios/${usuarioId}/estadisticas?tipo=${tipo}`,
        {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPromedio(data.promedio);
        setTotal(data.total);
      } else {
        setError("No se pudieron cargar las calificaciones");
      }
    } catch (error) {
      setError("Error de conexión al cargar calificaciones");
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return <span className="pi pi-spin pi-spinner text-sm mr-2"></span>;
  }

  if (error) {
    return null; // No mostrar nada en caso de error
  }

  return (
    <div className="detail-item justify-content-center">
    <div className="flex flex-column md:flex-row md:align-items-center gap-1 md:gap-2 ml-2">
      <div className="flex align-items-center">
        <Rating 
          value={promedio} 
          readOnly 
          cancel={false}
          stars={5} 
          className="text-sm" 
          pt={{
            onIcon: { className: 'text-yellow-500 text-xs md:text-sm' },
            offIcon: { className: 'text-gray-300 text-xs md:text-sm' }
          }}
        />
        <span className="text-xs md:text-sm font-medium ml-1 text-gray-700">
          {promedio.toFixed(1)}
        </span>
      </div>
      <span className="text-xs text-gray-500 md:mt-0">
        ({total} {total === 1 ? 'calif.' : 'calif.'})
      </span>
    </div>
  </div>
  );
};

export default EstrellasCalificacion;