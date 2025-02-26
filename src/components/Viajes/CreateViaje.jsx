import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { AutoComplete } from "primereact/autocomplete";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import axios from "axios";

const CreateViaje = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const [localidades, setLocalidades] = useState([]);
  const [filteredLocalidades, setFilteredLocalidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();
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
        setMensaje({ severity: "error", summary: "Error", detail: "Error al cargar localidades" });
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
  
      const responseData = await response.json();
      
      if (response.ok) {
        setMensaje({ severity: "success", summary: "Éxito", detail: "Viaje creado exitosamente" });
        reset();
        navigate("/viajes");
      }
       else {
        console.error('Server response:', responseData);
        setMensaje({ 
          severity: "error", 
          summary: "Error", 
          detail: responseData.error || "Error al crear el viaje" 
        });
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      setMensaje({ 
        severity: "error", 
        summary: "Error de conexión", 
        detail: "Error al conectar con el servidor" 
      });
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    {
      name: "id_origen",
      label: "Origen",
    component: (field, errors) => (
        <AutoComplete
          value={field.value}
          onChange={(e) => field.onChange(e.value)}
          suggestions={filteredLocalidades}
          completeMethod={searchLocalidades}
          field="nombre"
          dropdown
          dropdownMode="current"
          placeholder="Seleccione el origen"
          dropdownIcon="pi pi-chevron-down"
          toggleable={true}
        />
      ),
      rules: { required: "El origen es obligatorio" }
    },
    {
      name: "id_destino",
      label: "Destino",
      component: (field, errors) => (
        <AutoComplete
          value={field.value}
          onChange={(e) => field.onChange(e.value)}
          suggestions={filteredLocalidades}
          completeMethod={searchLocalidades}
          field="nombre"
          dropdown
          dropdownMode="current"
          placeholder="Seleccione el destino"
          dropdownIcon="pi pi-chevron-down"
          toggleable={true}
        />
      ),
      rules: { required: "El destino es obligatorio" }
    },
    {
      name: "fecha_salida",
      label: "Fecha y hora de salida",
      component: (field, errors) => (
        <Calendar
          value={field.value}
          onChange={(e) => field.onChange(e.value)}
          showTime
          hourFormat="24"
          placeholder="Seleccione la fecha y hora de salida"
          minDate={new Date()}
          showIcon
          manualInput={true}
        />
      ),
      rules: { required: "La fecha de salida es obligatoria" }
    },
    {
      name: "asientos_disponibles",
      label: "Asientos Disponibles",
      component: (field, errors) => (
        <InputNumber
          value={field.value}
          onValueChange={(e) => field.onChange(e.value)}
          min={1}
          max={10}
          placeholder="Número de asientos"
        />
      ),
      rules: { 
        required: "Debe ingresar la cantidad de asientos",
        min: { value: 1, message: "Mínimo 1 asiento" }
      },
      defaultValue: 1
    },
    {
      name: "precio",
      label: "Precio por persona",
      component: (field, errors) => (
        <div className="p-inputgroup">
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
      ),
      rules: { 
        required: "El precio es obligatorio",
        min: { value: 0, message: "El precio no puede ser negativo" }
      },
      defaultValue: 0
    },
    {
      name: "mascotas",
      label: "¿Permite mascotas?",
      component: (field, errors) => (
        <div className="p-field-switch p-my-4">
          <InputSwitch
            checked={field.value}
            onChange={(e) => field.onChange(e.value)}
          />
        </div>
      ),
      defaultValue: false
    },
    {
      name: "observaciones",
      label: "Observaciones",
      component: (field, errors) => (
        <InputText
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
          placeholder="Ingrese observaciones adicionales"
          maxLength={500}
        />
      ),
      defaultValue: ""
    }
  ];

  const header = <h2>Crear Viaje</h2>;
  
  return (
    <Card>
      {header}
      <Divider />
      
      {mensaje && (
        <Message severity={mensaje.severity} text={mensaje.detail} />
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Panel>
          <div className="p-fluid">
            {formFields.map((fieldConfig, index) => (
              <div className="p-field p-mb-4" key={index}>
                <label htmlFor={fieldConfig.name} className="p-d-block p-mb-2">{fieldConfig.label}</label>
                <Controller
                  name={fieldConfig.name}
                  control={control}
                  defaultValue={fieldConfig.defaultValue || ""}
                  rules={fieldConfig.rules}
                  render={({ field }) => (
                    <>
                      {fieldConfig.component(field, errors)}
                      {errors[fieldConfig.name] && (
                        <small className="p-error">{errors[fieldConfig.name].message}</small>
                      )}
                    </>
                  )}
                />
              </div>
            ))}
            
            <div className="p-field p-mt-4 pt-4">
              <Button
                label={loading ? "Cargando..." : "Crear Viaje"}
                icon="pi pi-check"
                type="submit"
                className="p-button-success"
                disabled={loading}
              />
            </div>
          </div>
        </Panel>
      </form>
    </Card>
  );
};

export default CreateViaje;