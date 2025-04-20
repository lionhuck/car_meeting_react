import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { AutoComplete } from "primereact/autocomplete";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { Image } from "primereact/image";
import { ProgressSpinner } from "primereact/progressspinner";


const API_URL = import.meta.env.VITE_API_URL;

const normalizeText = (text) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};


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
        const response = await fetch(`${API_URL}/localidades`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const localidadesFormateadas = [];
        
          for (const [provinciaNombre, provinciaData] of Object.entries(data)) {
            for (const loc of provinciaData.localidades) {
              localidadesFormateadas.push({
                id: loc.id,
                nombre: `${loc.nombre}, ${provinciaNombre}`
              });
            }
          }
        
          setLocalidades(localidadesFormateadas);
        } else {
          throw new Error("Error en la respuesta del servidor");
        }
      } catch (error) {
        console.error("Error al cargar localidades:", error);
        setMensaje({
          severity: "error",
          summary: "Error",
          detail: "Error al cargar localidades"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLocalidades();
  }, []);


  const searchLocalidades = (event) => {
  const query = normalizeText(event.query);
  setFilteredLocalidades(
    localidades.filter((localidad) =>
      normalizeText(localidad.nombre).includes(query)
    )
  );
};
  const isValidDate = (date) => {
    if (!date) return false;
    return date instanceof Date && !isNaN(date);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("token"));

      // Validar fecha manualmente
      if (!isValidDate(data.fecha_salida)) {
        throw new Error("La fecha y hora ingresadas no son válidas");
      }

      const fechaSalida = new Date(data.fecha_salida);
      
      const formData = {
        id_origen: parseInt(data.id_origen.id),
        id_destino: parseInt(data.id_destino.id),
        fecha_salida: fechaSalida.toISOString().replace('T', ' ').split('.')[0],
        asientos: parseInt(data.asientos),
        precio: parseInt(data.precio),
        observaciones: data.observaciones || null
      };
  
      const response = await fetch(`${API_URL}/viajes`, {
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
        navigate("/viajes-propuestos");
      } else {
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
        detail: error.message || "Error al conectar con el servidor" 
      });
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    {
      name: "id_origen",
      label: " Origen",
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
          itemTemplate={(item) => {
            const [localidad, provincia] = item.nombre.split(", ");
            return (
              <div>
                <strong>{localidad}</strong><br />
                <small>{provincia}</small>
              </div>
            );
          }}
        />
      ),
      rules: { required: "El origen es obligatorio" }
    },
    {
      name: "id_destino",
      label: " Destino",
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
          itemTemplate={(item) => {
            const [localidad, provincia] = item.nombre.split(", ");
            return (
              <div>
                <strong>{localidad}</strong><br />
                <small>{provincia}</small>
              </div>
            );
          }}
        />
      ),
      rules: { required: "El destino es obligatorio" }
    },
    {
      name: "fecha_salida",
      label: " Fecha y hora de salida",
      component: (field, errors) => {
        const today = new Date();
        const maxDate = new Date();
        maxDate.setMonth(today.getMonth() + 1);
    
        return (
          <div className="p-fluid">
            <Calendar
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
              dateFormat="dd/mm/yy"
              timeFormat="HH:mm"
              showTime
              hourFormat="24"
              placeholder="Seleccione fecha y hora"
              minDate={today}
              maxDate={maxDate}
              showIcon
              touchUI // Esto hace que el calendario sea más amigable para móviles
              className={errors.fecha_salida ? "p-invalid" : ""}
            />
            <small className="p-d-block p-mt-1">
              Toque para seleccionar fecha y hora
            </small>
          </div>
        );
      },
      rules: { 
        required: "La fecha de salida es obligatoria",
        validate: (value) => isValidDate(value) || "Fecha/hora inválida"
      }
    },
    {
      name: "asientos",
      label: " Asientos Disponibles",
      component: (field, errors) => (
        <InputNumber
          value={field.value}
          onValueChange={(e) => field.onChange(e.value)}
          min={1}
          max={10}
          placeholder="Número de asientos"
          className={errors.asientos ? "p-invalid" : ""}
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
      label: " Precio por persona",
      component: (field, errors) => (
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">$</span>
          <InputNumber
            value={field.value}
            onValueChange={(e) => field.onChange(e.value)}
            mode="currency"
            currency="ARS"
            locale="es-AR"
            min={1}
            className={errors.precio ? "p-invalid" : ""}
          />
        </div>
      ),
      rules: { 
        required: "El precio es obligatorio",
        min: { value: 1, message: "El precio no puede ser negativo" }
      },
      defaultValue: 0
    },
    {
      name: "observaciones",
      label: " Observaciones",
      component: (field, errors) => (
        <InputText
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
          placeholder="Ingrese observaciones adicionales"
          maxLength={500}
          className={errors.observaciones ? "p-invalid" : ""}
        />
      ),
      defaultValue: ""
    }
  ];

  const header = <h2>Crear Viaje</h2>;
  
  return (
    <div className="p-d-flex p-jc-center">
      <Card className="p-shadow-8" style={{ width: '100%', maxWidth: '800px' }}>
        <div className="p-d-flex p-jc-center p-mb-4">
          <Image 
            alt="Viajar es compartir" 
            width="100%"
            preview 
            className="p-shadow-4"
            style={{ borderRadius: '10px', maxHeight: '200px', objectFit: 'cover' }}
          />
        </div>
        
        <div className="p-text-center p-mb-4">
          <h2 style={{ color: 'var(--primary-color)' }}>¡Comparte tu próximo viaje!</h2>
          <p className="p-mt-2" style={{ color: 'var(--text-color-secondary)' }}>
            Llena este formulario y conecta con personas que compartan tu ruta. 
          </p>
        </div>
        
        <Divider />
        
        {mensaje && (
          <Message 
            severity={mensaje.severity} 
            text={mensaje.detail} 
            className="p-mb-4" 
          />
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <Panel 
            header="Detalles del viaje" 
            toggleable
            className="p-mb-4"
            style={{ background: 'var(--surface-ground)' }}
          >
            <div className="p-grid p-formgrid">
              {formFields.map((fieldConfig, index) => (
                <div className="p-field p-col-12 p-md-6" key={index}>
                  <label htmlFor={fieldConfig.name} className="p-d-block p-mb-2">
                    <i className={`pi ${getFieldIcon(fieldConfig.name)} p-mr-2`} />
                    {fieldConfig.label}
                    {fieldConfig.rules?.required && <span className="p-error"> *</span>}
                  </label>
                  <Controller
                    name={fieldConfig.name}
                    control={control}
                    defaultValue={fieldConfig.defaultValue || ""}
                    rules={fieldConfig.rules}
                    render={({ field }) => (
                      <>
                        {fieldConfig.component(field, errors)}
                        {errors[fieldConfig.name] && (
                          <small className="p-error p-d-block">
                            {errors[fieldConfig.name].message}
                          </small>
                        )}
                      </>
                    )}
                  />
                </div>
              ))}
            </div>
          </Panel>
          
          <div className="p-d-flex p-jc-center p-mt-4">
            <Button
              label={loading ? "Creando tu viaje..." : "Publicar Viaje"}
              icon={loading ? null : "pi pi-send"}
              type="submit"
              className="p-button-success"
              disabled={loading}
            >
              {loading && <ProgressSpinner 
                style={{ width: '20px', height: '20px' }} 
                strokeWidth="6" 
                className="p-mr-2" 
              />}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

// Función auxiliar para iconos
const getFieldIcon = (fieldName) => {
  switch(fieldName) {
    case 'id_origen': return 'pi-map-marker';
    case 'id_destino': return 'pi-flag-fill';
    case 'fecha_salida': return 'pi-clock';
    case 'asientos': return 'pi-users';
    case 'precio': return 'pi-money-bill';
    case 'observaciones': return 'pi-comment';
    default: return 'pi-info-circle';
  }
};

export default CreateViaje;