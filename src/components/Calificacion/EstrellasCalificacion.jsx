// EstrellasCalificacion.jsx (versión simplificada)
import React, { useState, useEffect } from "react";
import { Rating } from "primereact/rating";

const EstrellasCalificacion = ({ conductorId, token }) => {
  const [promedio, setPromedio] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (conductorId) {
      fetch(`${import.meta.env.VITE_API_URL}/usuarios/${conductorId}/estadisticas`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then((res) => res.json())
        .then((data) => {
          setPromedio(data.promedio || 0);
          setTotal(data.total || 0);
        })
        .catch(() => {
          setPromedio(0);
          setTotal(0);
        });
    }
  }, [conductorId, token]);

  return (
    <div className="flex align-items-center gap-2">
      <Rating value={promedio} readOnly cancel={false} stars={5} className="text-sm" />
      <span className="text-sm">
        {promedio.toFixed(1)} ({total} {total === 1 ? 'calificación' : 'calificaciones'})
      </span>
    </div>
  );
};

export default EstrellasCalificacion;