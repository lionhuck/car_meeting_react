import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";

const API_URL = import.meta.env.VITE_API_URL;

const EditarPerfil = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
  });
  const [cargando, setCargando] = useState(true);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [cambiosRequierenVerificacion, setCambiosRequierenVerificacion] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        setCargando(true);
        const response = await fetch(`${API_URL}/perfil`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
    
        if (!response.ok) {
          throw new Error(`Error en la respuesta del servidor: ${response.status}`);
        }
    
        const data = await response.json();
        setUsuario(data);
      } catch (error) {
        console.error("Error al obtener perfil:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo cargar la información del perfil",
          life: 3000,
        });
      } finally {
        setCargando(false);
      }
    };
    
    obtenerPerfil();
  }, [token]);

  const validationSchema = Yup.object().shape({
    nombre: Yup.string(),
    apellido: Yup.string(),
    password: Yup.string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .nullable(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const datosEnvio = {};
  
      // Solo enviar los campos que han sido modificados
      Object.keys(values).forEach(key => {
        if (values[key] && values[key] !== usuario[key]) {
          datosEnvio[key] = values[key];
        }
      });
  
      if (Object.keys(datosEnvio).length === 0) {
        toast.current.show({
          severity: "warn",
          summary: "Atención",
          detail: "No hay cambios para actualizar",
          life: 3000,
        });
        setSubmitting(false);
        return;
      }
  
      const response = await fetch(`${API_URL}/perfil`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(datosEnvio),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.current.show({
          severity: "success",
          summary: "Perfil actualizado",
          detail: data.mensaje,
          life: 3000,
        });
  
        if (data.requiere_verificacion) {
          setShowVerificationDialog(true);
          localStorage.removeItem("token")
          setIsAuthenticated(false)
          setVisible(false)
          navigate("/inicio-sesion")
        } else {
          setTimeout(() => navigate("/perfil"), 1500);
        }
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.mensaje || "No se pudo actualizar el perfil",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Ha ocurrido un error al actualizar el perfil",
        life: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleVerificationDialogClose = () => {
    setShowVerificationDialog(false);
    navigate("/login");
  };

  if (cargando) {
    return <div>Cargando información del perfil...</div>;
  }

  return (
    <div className="flex justify-content-center">
      <Card title="Editar Perfil" className="w-full md:w-8 lg:w-6">
        <Toast ref={toast} />
        <Formik
          initialValues={{
            nombre:"",
            apellido:"",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, handleChange, values, errors, touched }) => (
            <Form className="p-fluid">
              <div className="field mb-3">
                <label htmlFor="nombre" className="block text-left font-bold mb-2">
                  Nombre actual: {usuario.nombre || "No disponible"}
                </label>
                <InputText
                  id="nombre"
                  name="nombre"
                  value={values.nombre}
                  onChange={handleChange}
                  className={errors.nombre && touched.nombre ? "p-invalid" : ""}
                />
                <ErrorMessage name="nombre" component="small" className="p-error block text-left" />
              </div>

              <div className="field mb-3">
                <label htmlFor="apellido" className="block text-left font-bold mb-2">
                  Apellido actual: {usuario.apellido || "No disponible"}
                </label>
                <InputText
                  id="apellido"
                  name="apellido"
                  value={values.apellido}
                  onChange={handleChange}
                  className={errors.apellido && touched.apellido ? "p-invalid" : ""}
                />
                <ErrorMessage name="apellido" component="small" className="p-error block text-left" />
              </div>
              <div className="field mb-4">
                <label htmlFor="password" className="block text-left font-bold mb-2">
                  Nueva contraseña (dejar vacío para mantener actual)
                </label>
                <Password
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  className={errors.password && touched.password ? "p-invalid" : ""}
                  toggleMask
                  feedback={false}
                />
                <small className="block text-left text-gray-500 mt-1">
                  Mínimo 8 caracteres. Deja en blanco si no deseas cambiarla. 
                  Al cambiar tu contraseña, deberás verificar tu email nuevamente antes de poder iniciar sesión.
                </small>
                <ErrorMessage name="password" component="small" className="p-error block text-left" />
              </div>

              <div className="flex justify-content-between">
                <Button
                  label="Cancelar"
                  icon="pi pi-times"
                  className="p-button-secondary"
                  onClick={() => navigate("/perfil")}
                  type="button"
                />
                <Button label="Guardar Cambios" icon="pi pi-check" type="submit" loading={isSubmitting} />
              </div>
            </Form>
          )}
        </Formik>

        <Dialog
          header="Verificación requerida"
          visible={showVerificationDialog}
          onHide={handleVerificationDialogClose}
          footer={
            <div>
              <Button label="Entendido" icon="pi pi-check" onClick={handleVerificationDialogClose} />
            </div>
          }
          style={{ width: '450px' }}
        >
          <div className="flex align-items-center justify-content-center flex-column">
            <i className="pi pi-envelope text-5xl mb-3 text-primary"></i>
            <p className="text-center">
              Has actualizado información importante de tu cuenta. 
              Para proteger tu seguridad, te hemos enviado un correo de verificación.
              Por favor, verifica tu correo electrónico para poder iniciar sesión nuevamente.
            </p>
          </div>
        </Dialog>
      </Card>
    </div>
  );
};

export default EditarPerfil;