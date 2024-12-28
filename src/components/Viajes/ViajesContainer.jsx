import React, { useState } from "react";
import ViajesView from "./ViajesView";

const ViajesContainer = () => {
  const [token, setToken] = useState(localStorage.getItem("token")); // O de donde guardes el token
  const [userId, setUserId] = useState(null);

  const handleAddPassenger = async (id_viaje) => {
    if (!token) {
      console.error("Token no encontrado");
      return;
    }

    const datos_pasajero = {
      id_equipaje: null, // Aquí podrías obtener los datos del equipaje si es necesario
    };

    const response = await fetch(`http://localhost:5000/viajes/${id_viaje}/agregar_pasajero`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_viaje,
        id_usuario: userId,
        datos_pasajero,
      }),
    });

    if (response.ok) {
      const updatedViaje = await response.json();
      alert("Te has unido al viaje correctamente!");
      // Aquí podrías actualizar el estado de los viajes si es necesario
    } else {
      console.error("Error al agregar pasajero");
    }
  };

  return (
    <div>
      <ViajesView token={token} onAddPassenger={handleAddPassenger} />
    </div>
  );
};

export default ViajesContainer;
