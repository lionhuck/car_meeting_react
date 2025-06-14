import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import * as Yup from "yup";

const API_URL = import.meta.env.VITE_API_URL;

const ReenviarVerificacion = () => {
  const [mensaje, setMensaje] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const response = await fetch(`${API_URL}/reenviar-verificacion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMensaje(data.mensaje || "Se ha reenviado el correo de verificación");
        toast.current.show({
          severity: "success",
          summary: "Correo Reenviado",
          detail: "Se ha reenviado el correo de verificación. Por favor, revisa tu bandeja de entrada.",
          life: 3000,
        });
      } else {
        setMensaje(data.mensaje || "Error al reenviar la verificación");
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.mensaje || "No se pudo reenviar el correo de verificación",
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

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Formato de email inválido")
      .required("El email es obligatorio"),
  });

  return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          padding: "0 1rem"
        }}>
          <h1 style={{ marginBottom: "1rem", fontSize: "1.75rem" }}>CAR MEETING</h1>
          <div className="p-d-flex p-jc-center p-ai-center" style={{ width: "100%" }}>
            <div
              className="p-card p-shadow-3"
              style={{ 
                width: "100%",
                maxWidth: "400px",
                padding: "1.5rem"
              }}
            >
          <Toast ref={toast} />
          <h2 className="p-text-center">Reenviar Verificación</h2>
          
          {mensaje && (
            <div 
              className="p-text-center p-mb-3" 
              style={{ marginBottom: "1rem" }}
            >
              {mensaje}
            </div>
          )}
          
          <p className="p-text-center" style={{ marginBottom: "1rem" }}>
            Ingresa tu dirección de correo electrónico y te enviaremos nuevamente el enlace de verificación.
          </p>
          
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ handleSubmit, isValid }) => (
              <form onSubmit={handleSubmit} className="p-fluid">
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

                <Button
                  label="Reenviar Verificación"
                  type="submit"
                  className="p-button mt-3"
                  disabled={!isValid}
                  style={{ width: "100%", marginTop: "1rem" }}
                />

                <Button
                  label="Volver al Login"
                  className="p-button-link mt-3"
                  onClick={() => navigate("/inicio-sesion")}
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

export default ReenviarVerificacion;