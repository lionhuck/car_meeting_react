import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Toast } from "primereact/toast";

const CalificarConductorDialog = ({
  visible,
  onHide,
  viajeId,
  conductor,
  token,
  toast,
  onCalificacionExitosa,
}) => {
  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

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

    try {
      setEnviando(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/viajes/${viajeId}/calificar/conductor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            estrellas,
            comentario: comentario.trim() || undefined, // Solo enviar si no está vacío
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Calificación enviada correctamente",
          life: 3000,
        });
        onCalificacionExitosa();
        resetForm();
        onHide();
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.error || "Error al enviar la calificación",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error de conexión al enviar la calificación",
        life: 3000,
      });
    } finally {
      setEnviando(false);
    }
  };

  const resetForm = () => {
    setEstrellas(0);
    setComentario("");
  };

  const footerContent = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={() => {
          resetForm();
          onHide();
        }}
        className="p-button-text"
      />
      <Button
        label="Enviar Calificación"
        icon="pi pi-check"
        onClick={enviarCalificacion}
        autoFocus
        loading={enviando}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      style={{ width: "90vw", maxWidth: "500px" }}
      header={`Calificar a ${conductor?.nombre || ""} ${
        conductor?.apellido || ""
      }`}
      footer={footerContent}
      onHide={() => {
        resetForm();
        onHide();
      }}
      dismissableMask
      closeOnEscape
    >
      <div className="p-fluid">
        <div className="field">
          <label htmlFor="rating" className="font-bold block mb-2">
            ¿Cómo calificarías tu experiencia?
          </label>
          <div className="flex justify-content-center my-4">
            <Rating
              id="rating"
              value={estrellas}
              onChange={(e) => setEstrellas(e.value)}
              cancel={false}
              stars={5}
              className="text-2xl"
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CalificarConductorDialog;
