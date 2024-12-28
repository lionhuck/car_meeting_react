import React, { useEffect, useState } from "react";

const ViajesView = ({ token, onAddPassenger }) => {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViajes = async () => {
      if (!token) {
        console.error("Token no encontrado");
        setLoading(false); // Asegurarse de que se deje de mostrar "Cargando viajes..."
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/viajes", {
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
        setLoading(false); // Asegurarse de que se deje de mostrar "Cargando viajes..."
      }
    };

    fetchViajes();
  }, [token]);

  if (loading) {
    return <div>Cargando viajes...</div>; // Esto solo se muestra mientras estamos cargando
  }

  return (
    <div>
      <h2>Listado de Viajes</h2>
      {viajes.length === 0 ? (
        <p>No hay viajes disponibles en este momento.</p>
      ) : (
        <ul>
          {viajes.map((viaje) => (
            <li key={viaje.id}>
              <div>
                <p>
                  <strong>Origen:</strong> {viaje.origen.nombre} <br />
                  <strong>Destino:</strong> {viaje.destino.nombre} <br />
                  <strong>Fecha:</strong> {new Date(viaje.fecha_salida).toLocaleString()} <br />
                  <strong>Conductor:</strong> {viaje.conductor.nombre} {viaje.conductor.apellido} <br />
                  <strong>Precio:</strong> ${viaje.precio} <br />
                  <strong>Asientos disponibles:</strong> {viaje.asientos_disponibles} <br />
                  <strong>Observaciones:</strong> {viaje.observaciones || "Ninguna"}
                </p>
                {viaje.activo && viaje.asientos_disponibles > 0 && (
                  <button
                    onClick={() => onAddPassenger(viaje.id)}
                    className="btn btn-success"
                  >
                    Unirse al viaje
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViajesView;
