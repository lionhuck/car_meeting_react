// src/components/Viajes/EquipajeModal.jsx
import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";

const API_URL = import.meta.env.VITE_API_URL;

const EquipajeModal = ({ visible, onHide, onSelect }) => {
  const [equipajes, setEquipajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEquipaje, setSelectedEquipaje] = useState(null);
  const token = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null;

  useEffect(() => {
    if (visible && token) {
      fetchEquipajes();
    }
  }, [visible, token]);

  const fetchEquipajes = async () => {
    try {
      const response = await fetch(`${API_URL}/equipajes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEquipajes(data);
        // Preseleccionar el primer equipaje
        if (data.length > 0) {
          setSelectedEquipaje(data[0].id);
        }
      }
    } catch (error) {
      console.error("Error obteniendo equipajes:", error);
    } finally {
      setLoading(false);
    }
  };

  const footerContent = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-text"
      />
      <Button
        label="Confirmar"
        icon="pi pi-check"
        onClick={() => onSelect(selectedEquipaje)}
        autoFocus
        disabled={!selectedEquipaje}
      />
    </div>
  );

  return (
    <Dialog
      header="Selecciona tu equipaje"
      visible={visible}
      style={{ width: "90%", maxWidth: "500px" }}
      onHide={onHide}
      footer={footerContent}
    >
      {loading ? (
        <div className="flex justify-content-center">
          <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
        </div>
      ) : (
        <div className="equipaje-options">
          {equipajes.map((equipaje) => (
            <div key={equipaje.id} className="field-radiobutton equipaje-option">
              <RadioButton
                inputId={`equipaje_${equipaje.id}`}
                name="equipaje"
                value={equipaje.id}
                onChange={(e) => setSelectedEquipaje(e.value)}
                checked={selectedEquipaje === equipaje.id}
              />
              <label htmlFor={`equipaje_${equipaje.id}`}>
                <strong>{equipaje.categoria}</strong>
                <p className="equipaje-descripcion">{equipaje.descripcion}</p>
              </label>
            </div>
          ))}
        </div>
      )}
    </Dialog>
  );
};

export default EquipajeModal;