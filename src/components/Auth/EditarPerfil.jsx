import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import axios from "axios";

const EditarPerfil = () => {
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    nombre_usuario: "",
    email: ""
  });
  const [cargando, setCargando] = useState(true);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        setCargando(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/perfil`);
        setUsuario(response.data);
        setCargando(false);
      } catch (error) {
        console.error("Error al obtener perfil:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo cargar la información del perfil",
          life: 3000
        });
        setCargando(false);
      }
    };
    obtenerPerfil();
  }, []);

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("El nombre es requerido"),
    apellido: Yup.string().required("El apellido es requerido"),
    nombre_usuario: Yup.string().required("El nombre de usuario es requerido"),
    email: Yup.string()
      .email("El email debe ser válido")
      .required("El email es requerido"),
    password: Yup.string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .nullable()
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Eliminar password si está vacío
      const datosEnvio = { ...values };
      if (!datosEnvio.password) {
        delete datosEnvio.password;
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/perfil`, datosEnvio);
      
      toast.current.show({
        severity: "success",
        summary: "Perfil actualizado",
        detail: "Tu información ha sido actualizada correctamente",
        life: 3000
      });
      
      // Opcional: actualizar los datos locales con la respuesta
      setUsuario(response.data.usuario);
      
      // Opcional: redirigir al usuario
      setTimeout(() => {
        navigate("/perfil");
      }, 1500);
      
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      
      const mensajeError = error.response?.data?.mensaje || 
                          "Ha ocurrido un error al actualizar el perfil";
      
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: mensajeError,
        life: 3000
      });
    } finally {
      setSubmitting(false);
    }
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
            nombre: usuario.nombre || "",
            apellido: usuario.apellido || "",
            nombre_usuario: usuario.nombre_usuario || "",
            email: usuario.email || "",
            password: ""
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, handleChange, values, errors, touched }) => (
            <Form className="p-fluid">
              <div className="field mb-3">
                <label htmlFor="nombre" className="block text-left font-bold mb-2">Nombre</label>
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
                <label htmlFor="apellido" className="block text-left font-bold mb-2">Apellido</label>
                <InputText
                  id="apellido"
                  name="apellido"
                  value={values.apellido}
                  onChange={handleChange}
                  className={errors.apellido && touched.apellido ? "p-invalid" : ""}
                />
                <ErrorMessage name="apellido" component="small" className="p-error block text-left" />
              </div>
              
              <div className="field mb-3">
                <label htmlFor="nombre_usuario" className="block text-left font-bold mb-2">Nombre de usuario</label>
                <InputText
                  id="nombre_usuario"
                  name="nombre_usuario"
                  value={values.nombre_usuario}
                  onChange={handleChange}
                  className={errors.nombre_usuario && touched.nombre_usuario ? "p-invalid" : ""}
                />
                <ErrorMessage name="nombre_usuario" component="small" className="p-error block text-left" />
              </div>
              
              <div className="field mb-3">
                <label htmlFor="email" className="block text-left font-bold mb-2">Email</label>
                <InputText
                  id="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  className={errors.email && touched.email ? "p-invalid" : ""}
                />
                <ErrorMessage name="email" component="small" className="p-error block text-left" />
              </div>
              
              <div className="field mb-4">
                <label htmlFor="password" className="block text-left font-bold mb-2">Contraseña (dejar vacío para mantener actual)</label>
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
                <Button
                  label="Guardar Cambios"
                  icon="pi pi-check"
                  type="submit"
                  loading={isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default EditarPerfil;