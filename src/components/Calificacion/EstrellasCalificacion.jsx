import React, { useState, useEffect } from "react";
import { Rating } from "primereact/rating";

const EstrellasCalificacion = ({ conductorId, token }) => {
  const [promedio, setPromedio] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (conductorId) {
      const obtenerCalificacion = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${conductorId}/estadisticas`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          const data = await response.json();
          console.log('data', data)
          setPromedio(data.promedio || 0);
          setTotal(data.total || 0);
        } catch {
          setPromedio(0);
          setTotal(0);
        }
      };
      obtenerCalificacion();
    }
  }, [conductorId, token]);

  return (
    <div className="flex align-items-center gap-2">
      <Rating value={promedio} readOnly cancel={false} stars={5} className="text-sm" />
      <span className="text-sm">
        {promedio.toFixed(1)} ({total} {total === 1 ? 'prom.' : 'calif'})
      </span>
    </div>
  );
};

export default EstrellasCalificacion;
