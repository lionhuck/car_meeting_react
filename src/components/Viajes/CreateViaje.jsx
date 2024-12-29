import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { AutoComplete } from "primereact/autocomplete";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import axios from "axios";

const CreateViaje = () => {
  const { control, handleSubmit, reset } = useForm();
  const [localidades, setLocalidades] = useState([]);
  const [filteredLocalidades, setFilteredLocalidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [datetime24h, setDateTime24h] = useState(null);
  const [checked, setChecked] = useState(false);
  const [value1, setValue1] = useState(1); // Asientos disponibles
  const [precio, setPrecio] = useState(0);

  // Cargar localidades al montar el componente
  useEffect(() => {
    const fetchLocalidades = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token"); // Obtener el token
        const response = await axios.get("http://localhost:5000/api/localidades", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLocalidades(response.data);
      } catch (error) {
        console.error("Error al cargar localidades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocalidades();
  }, []);

  // Filtrar localidades por nombre
  const searchLocalidades = (event) => {
    const query = event.query.toLowerCase();
    setFilteredLocalidades(
      localidades.filter((localidad) =>
        localidad.nombre.toLowerCase().includes(query)
      )
    );
  };

  // Manejar el envío del formulario
  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/viajes", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        setMensaje(data.mensaje || "Viaje creado exitosamente");
        reset(); // Limpiar formulario después de creación
      } else {
        setMensaje(data.mensaje || "Hubo un error al crear el viaje");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      setMensaje("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Crear Viaje</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="viaje-form">
        <div className="form-group">
      
          <Controller
            name="id_origen"
            control={control}
            defaultValue=""
            rules={{ required: "El origen es obligatorio" }}
            render={({ field }) => (
              <AutoComplete
                {...field}
                suggestions={filteredLocalidades}
                completeMethod={searchLocalidades}
                field="nombre"
                dropdown
                placeholder="Seleccione el origen"
              />
            )}
          />
        </div>

        <div className="form-group">
          <Controller
            name="id_destino"
            control={control}
            defaultValue=""
            rules={{ required: "El destino es obligatorio" }}
            render={({ field }) => (
              <AutoComplete
                {...field}
                suggestions={filteredLocalidades}
                completeMethod={searchLocalidades}
                field="nombre"
                dropdown
                placeholder="Seleccione el destino"
              />
            )}
          />
        </div>

        <div className="form-group">

          <Controller
            name="fecha_salida"
            control={control}
            defaultValue=""
            rules={{ required: "La fecha de salida es obligatoria" }}
            render={({ field }) => (
              <Calendar
                value={datetime24h}
                onChange={(e) => setDateTime24h(e.value)}
                showTime
                hourFormat="24"
                placeholder="Seleccione la fecha y hora de salida"
              />
            )}
          />
        </div>

        <div className="card flex flex-wrap gap-3 p-fluid justify-content-center">
        <label htmlFor="asientos_disponibles" className="font-bold block mb-2 ]">Asientos Disponibles</label>
          <Controller
            name="asientos_disponibles"
            control={control}
            defaultValue={1}
            rules={{ required: "Debe ingresar la cantidad de asientos" }}
            render={({ field }) => (
              <InputNumber
                value={value1}
                onValueChange={(e) => setValue1(e.value)}
                min={1}
                max={15}
                placeholder="Número de asientos"
              />
            )}
          />
        </div>

        <div className="form-group">
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">$</span>
            <InputNumber
              value={precio}
              onValueChange={(e) => setPrecio(e.value)}
              min={0}
              placeholder="Ingrese el precio por pasajero"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="mascotas">¿Permite mascotas?</label>
          <Controller
            name="mascotas"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <InputSwitch
                checked={checked}
                onChange={(e) => setChecked(e.value)}
              />
            )}
          />
        </div>

        <div className="form-group">
          <Controller
            name="observaciones"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <InputText
                {...field}
                type="text"
                placeholder="Ingrese observaciones adicionales"
              />
            )}
          />
        </div>

        <div className="form-group">
          <Button
            label={loading ? "Cargando..." : "Crear Viaje"}
            type="submit"
            className="p-button-success p-button-lg"
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateViaje;
