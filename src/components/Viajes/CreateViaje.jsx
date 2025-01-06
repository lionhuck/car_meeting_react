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
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const [localidades, setLocalidades] = useState([]);
  const [filteredLocalidades, setFilteredLocalidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchLocalidades = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/localidades", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setLocalidades(response.data);
      } catch (error) {
        console.error("Error al cargar localidades:", error);
        setMensaje("Error al cargar localidades");
      } finally {
        setLoading(false);
      }
    };

    fetchLocalidades();
  }, []);

  const searchLocalidades = (event) => {
    const query = event.query.toLowerCase();
    setFilteredLocalidades(
      localidades.filter((localidad) =>
        localidad.nombre.toLowerCase().includes(query)
      )
    );
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("token"));
      const formData = {
        id_origen: parseInt(data.id_origen.id),
        id_destino: parseInt(data.id_destino.id),
        fecha_salida: data.fecha_salida.toISOString().split('.')[0],
        asientos_disponibles: parseInt(data.asientos_disponibles),
        precio: parseInt(data.precio),
        mascotas: data.mascotas || false,
        observaciones: data.observaciones || null
      };
  
      console.log('Sending data:', formData);
  
      const response = await fetch("http://127.0.0.1:5000/viajes", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      // ...rest of the code
      if (response.ok) {
        setMensaje("Viaje creado exitosamente");
        reset();
      } else {
        console.error('Server response:', responseData);
        setMensaje(responseData.error || "Error al crear el viaje");
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
      {mensaje && (
        <div className={`mensaje ${mensaje.includes("error") ? "error" : "success"}`}>
          {mensaje}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="viaje-form">
        <div className="form-group">
          <Controller
            name="id_origen"
            control={control}
            defaultValue=""
            rules={{ required: "El origen es obligatorio" }}
            render={({ field }) => (
              <>
                <AutoComplete
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  suggestions={filteredLocalidades}
                  completeMethod={searchLocalidades}
                  field="nombre"
                  dropdown
                  placeholder="Seleccione el origen"
                />
                {errors.id_origen && (
                  <small className="error">{errors.id_origen.message}</small>
                )}
              </>
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
              <>
                <AutoComplete
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  suggestions={filteredLocalidades}
                  completeMethod={searchLocalidades}
                  field="nombre"
                  dropdown
                  placeholder="Seleccione el destino"
                />
                {errors.id_destino && (
                  <small className="error">{errors.id_destino.message}</small>
                )}
              </>
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
              <>
                <Calendar
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  showTime
                  hourFormat="24"
                  placeholder="Seleccione la fecha y hora de salida"
                  minDate={new Date()}
                />
                {errors.fecha_salida && (
                  <small className="error">{errors.fecha_salida.message}</small>
                )}
              </>
            )}
          />
        </div>

        <div className="form-group">
          <label htmlFor="asientos_disponibles" className="font-bold block mb-2">
            Asientos Disponibles
          </label>
          <Controller
            name="asientos_disponibles"
            control={control}
            defaultValue={1}
            rules={{ 
              required: "Debe ingresar la cantidad de asientos",
              min: { value: 1, message: "Mínimo 1 asiento" }
            }}
            render={({ field }) => (
              <>
                <InputNumber
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  min={1}
                  max={10}
                  placeholder="Número de asientos"
                />
                {errors.asientos_disponibles && (
                  <small className="error">{errors.asientos_disponibles.message}</small>
                )}
              </>
            )}
          />
        </div>

        <div className="form-group">
          <Controller
            name="precio"
            control={control}
            defaultValue={0}
            rules={{ 
              required: "El precio es obligatorio",
              min: { value: 0, message: "El precio no puede ser negativo" }
            }}
            render={({ field }) => (
              <>
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">$</span>
                  <InputNumber
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    min={0}
                    mode="currency"
                    currency="ARS"
                    locale="es-AR"
                  />
                </div>
                {errors.precio && (
                  <small className="error">{errors.precio.message}</small>
                )}
              </>
            )}
          />
        </div>

        <div className="form-group">
          <label htmlFor="mascotas">¿Permite mascotas?</label>
          <Controller
            name="mascotas"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <InputSwitch
                checked={field.value}
                onChange={(e) => field.onChange(e.value)}
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
                maxLength={500}
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