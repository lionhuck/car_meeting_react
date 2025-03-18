import { useNavigate } from 'react-router-dom';
import { Formik, Field, ErrorMessage } from 'formik';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import * as Yup from 'yup';

const API_URL = import.meta.env.VITE_API_URL;

const SolicitarReset = () => {
  const toast = useRef(null);
  const navigate = useNavigate();

  const onSolicitarReset = async (values) => {
    try {
      const response = await fetch(`${API_URL}/solicitar-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.current.show({
          severity: "success",
          summary: "Solicitud Enviada",
          detail: data.mensaje || "Se ha enviado un correo con instrucciones para recuperar tu contraseña",
          life: 5000,
        });
        // Opcional: redirigir al usuario al login después de unos segundos
        setTimeout(() => navigate('/login'), 5000);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.mensaje || "No se pudo procesar la solicitud",
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
    email: Yup.string()
      .email("Introduce un email válido")
      .required("El email es requerido"),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <h1 style={{ marginBottom: "1rem" }}>CAR MEETING</h1>
      <div className="p-d-flex p-jc-center p-ai-center">
        <div className="p-card p-shadow-3" style={{ width: "400px", padding: "2rem" }}>
          <Toast ref={toast} />
          <h2 className="p-text-center">Recuperar Contraseña</h2>
          <p className="p-text-center">
            Introduce tu email y te enviaremos instrucciones para recuperar tu contraseña.
          </p>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => onSolicitarReset(values)}
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
                  className="p-button mt-3"
                  label="Enviar Instrucciones"
                  type="submit"
                  disabled={!isValid}
                  style={{ width: "100%", marginTop: "1rem" }}
                />
                
                <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                  <Button
                    label="Volver al Login"
                    className="p-button-text"
                    onClick={() => navigate("/login")}
                    type="button"
                  />
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default SolicitarReset;