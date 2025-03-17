import { Formik, Field, ErrorMessage } from "formik";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import * as Yup from "yup";

const RegistroUsuario = () => {
  const [mensaje, setMensaje] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [emailRegistrado, setEmailRegistrado] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate();

  // Función para manejar el envío del formulario
  const onSubmit = async (values) => {
    try {
      // Registramos al usuario
      const response = await fetch(`${process.env.REACT_APP_API_URL}/registro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      
      if (response.ok) {
        setEmailRegistrado(values.email);
        setRegistroExitoso(true);
        setMensaje(data.mensaje || "Usuario registrado exitosamente. Por favor, verifica tu correo electrónico.");
        
        toast.current.show({
          severity: "success",
          summary: "Registro Exitoso",
          detail: "Se ha enviado un correo de verificación a tu dirección de email.",
          life: 5000,
        });
        
        // Ya no hacemos login automático, esperamos verificación de email
      } else {
        setMensaje(data.mensaje || "Hubo un error al registrar el usuario");
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.mensaje || "Hubo un error al registrar el usuario",
          life: 3000,
        });
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor");
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al conectar con el servidor",
        life: 3000,
      });
    }
  };

  const handleReenviarVerificacion = async () => {
    if (!emailRegistrado) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reenviar-verificacion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailRegistrado }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.current.show({
          severity: "success",
          summary: "Correo Reenviado",
          detail: data.mensaje || "Se ha reenviado el correo de verificación",
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.mensaje || "No se pudo reenviar el correo de verificación",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al conectar con el servidor",
        life: 3000,
      });
    }
  };

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().min(2).max(50).required("El nombre es obligatorio"),
    apellido: Yup.string()
      .min(2)
      .max(50)
      .required("El apellido es obligatorio"),
    nombre_usuario: Yup.string()
      .min(3)
      .max(50)
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "El nombre de usuario solo puede contener letras, números y guiones bajos"
      )
      .required("El nombre de usuario es obligatorio"),
    email: Yup.string()
      .email("Formato de email inválido")
      .required("El email es obligatorio"),
    password: Yup.string()
      .min(8)
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        "La contraseña debe contener letras y números"
      )
      .required("La contraseña es obligatoria"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
      .required("Debes confirmar la contraseña"),
  });

  // Si el registro fue exitoso, mostrar mensaje de verificación
  if (registroExitoso) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1 style={{ marginBottom: "1rem" }}>CAR MEETING</h1>
        <div className="p-d-flex p-jc-center p-ai-center">
          <div
            className="p-card p-shadow-3"
            style={{ width: "500px", padding: "2rem" }}
          >
            <Toast ref={toast} />
            <h2 className="p-text-center">Verificación de Email</h2>
            
            <div className="p-text-center p-mb-3" style={{marginBottom: "1rem"}}>
              Se ha enviado un correo de verificación a <strong>{emailRegistrado}</strong>. 
              Por favor, revisa tu bandeja de entrada y sigue las instrucciones para verificar tu cuenta.
            </div>
            
            <div className="p-text-center p-mb-3" style={{marginBottom: "1rem"}}>
              Si no has recibido el correo, revisa tu carpeta de spam o haz clic en el botón para reenviar.
            </div>
            
            <div className="p-text-center" style={{marginBottom: "1rem"}}>
              <Button
                label="Reenviar Verificación"
                onClick={handleReenviarVerificacion}
                className="p-button-outlined"
                style={{ marginRight: "1rem" }}
              />
              <Button
                label="Ir a Login"
                onClick={() => navigate("/login")}
                className="p-button"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>CAR MEETING</h1>
      <div className="p-d-flex p-jc-center p-ai-center">
        <div
          className="p-card p-shadow-3"
          style={{ width: "400px", padding: "2rem" }}
        >
          <Toast ref={toast} />
          <h2 className="p-text-center">Registrarse</h2>
          {mensaje && <div className="p-text-center p-mb-3">{mensaje}</div>}
          <Formik
            initialValues={{
              nombre: "",
              apellido: "",
              nombre_usuario: "",
              email: "",
              password: "",
              confirm_password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ handleSubmit, isValid, values, handleChange }) => (
              <form onSubmit={handleSubmit} className="p-fluid">
                <div className="p-field">
                  <label htmlFor="nombre">Nombre</label>
                  <Field
                    as={InputText}
                    id="nombre"
                    name="nombre"
                    className="p-inputtext"
                  />
                  <ErrorMessage
                    name="nombre"
                    component="small"
                    style={{ color: "red" }}
                  />
                </div>

                <div className="p-field">
                  <label htmlFor="apellido">Apellido</label>
                  <Field
                    as={InputText}
                    id="apellido"
                    name="apellido"
                    className="p-inputtext"
                  />
                  <ErrorMessage
                    name="apellido"
                    component="small"
                    style={{ color: "red" }}
                  />
                </div>

                <div className="p-field">
                  <label htmlFor="nombre_usuario">Nombre de usuario</label>
                  <Field
                    as={InputText}
                    id="nombre_usuario"
                    name="nombre_usuario"
                    className="p-inputtext"
                  />
                  <ErrorMessage
                    name="nombre_usuario"
                    component="small"
                    style={{ color: "red" }}
                  />
                </div>

                <div className="p-field">
                  <label htmlFor="email">Email</label>
                  <Field
                    as={InputText}
                    id="email"
                    name="email"
                    className="p-inputtext"
                  />
                  <ErrorMessage
                    name="email"
                    component="small"
                    style={{ color: "red" }}
                  />
                </div>

                <div className="p-field">
                  <label htmlFor="password">Contraseña</label>
                  <Field
                    as={InputText}
                    id="password"
                    type="password"
                    name="password"
                    className="p-inputtext"
                  />
                  <ErrorMessage
                    name="password"
                    component="small"
                    style={{ color: "red" }}
                  />
                </div>

                <div className="p-field">
                  <label htmlFor="confirm_password">Confirmar contraseña</label>
                  <Field
                    as={InputText}
                    id="confirm_password"
                    type="password"
                    name="confirm_password"
                    className="p-inputtext"
                  />
                  <ErrorMessage
                    name="confirm_password"
                    component="small"
                    style={{ color: "red" }}
                  />
                </div>

                <Button
                  label="Registrarse"
                  type="submit"
                  className="p-button mt-3"
                  disabled={!isValid}
                  style={{ width: "100%", marginTop: "1rem" }}
                />

                <Button
                  label="¿Ya tienes cuenta? Iniciar sesión"
                  className="p-button-link mt-3"
                  onClick={() => navigate("/login")}
                  style={{ width: "100%", marginTop: "0.5rem" }}
                  type="button"
                />
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RegistroUsuario;