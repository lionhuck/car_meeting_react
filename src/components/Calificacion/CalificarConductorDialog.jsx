// CalificarConductorDialog.jsx (versión simplificada)
import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Toast } from "primereact/toast";

const CalificarConductorDialog = ({ visible, onHide, viajeId, conductor, token, toast }) => {
  const [estrellas, setEstrellas] = useState(0);
  const [loading, setLoading] = useState(false);

  const enviarCalificacion = async () => {
    if (estrellas === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Debes seleccionar al menos una estrella",
        life: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/viajes/${viajeId}/calificar/conductor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ estrellas }),
        }
      );

      if (response.ok) {
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "¡Gracias por tu calificación!",
          life: 3000,
        });
        onHide();
      } else {
        const error = await response.json();
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.error || "Error al enviar calificación",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error de conexión",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={`Calificar a ${conductor.nombre}`}
      style={{ width: "90vw", maxWidth: "400px" }}
    >
      <div className="p-fluid">
        <div className="field">
          <label className="block mb-4 text-center">
            ¿Cómo calificarías tu viaje con {conductor.nombre}?
          </label>
          <div className="flex justify-content-center mb-6">
            <Rating
              value={estrellas}
              onChange={(e) => setEstrellas(e.value)}
              cancel={false}
              stars={5}
              className="text-3xl"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-content-end gap-2">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          onClick={onHide}
          className="p-button-text"
        />
        <Button
          label={loading ? "Enviando..." : "Enviar"}
          icon="pi pi-check"
          onClick={enviarCalificacion}
          loading={loading}
        />
      </div>
    </Dialog>
  );
};

export default CalificarConductorDialog;