import { useNavigate } from 'react-router-dom';
import { Formik, Field, ErrorMessage } from 'formik';
import { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import * as Yup from 'yup';

const API_URL = import.meta.env.VITE_API_URL;

const LoginUser = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [emailNoVerificado, setEmailNoVerificado] = useState(null);

  const onLoginUser = async (values) => {
    const bodyLoginUser = btoa(`${values.username}:${values.password}`);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${bodyLoginUser}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Verificar si el error es porque el email no está verificado
        if (data.mensaje && data.mensaje.includes("Correo electrónico no verificado")) {
          setEmailNoVerificado(values.username);
          toast.current.show({
            severity: "warn",
            summary: "Email no verificado",
            detail: "Tu correo electrónico aún no ha sido verificado. Por favor, verifica tu correo o solicita un nuevo enlace de verificación.",
            life: 5000,
          });
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: data.mensaje || "Inicio de sesión fallido",
            life: 3000,
          });
        }
        return;
      }

      // Si el login es exitoso
      localStorage.setItem("token", JSON.stringify(data.token));

      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Inicio de sesión exitoso",
        life: 3000,
      });
      navigate('/viajes');
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al conectar con el servidor",
        life: 3000,
      });
    }
  };

  const handleReenviarVerificacion = async () => {
    if (!emailNoVerificado) return;
    
    try {
      const response = await fetch(`${API_URL}/reenviar-verificacion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailNoVerificado }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.current.show({
          severity: "success",
          summary: "Correo Reenviado",
          detail: data.mensaje || "Se ha reenviado el correo de verificación",
          life: 3000,
        });
        setEmailNoVerificado(null);
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
    username: Yup.string().required("El nombre de usuario o email es requerido"),
    password: Yup.string().required("La contraseña es requerida"),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <h1 style={{ marginBottom: "1rem" }}>CAR MEETING</h1>
      <div className="p-d-flex p-jc-center p-ai-center">
        <div className="p-card p-shadow-3" style={{ width: "400px", padding: "2rem" }}>
          <Toast ref={toast} />
          <h2 className="p-text-center">Iniciar Sesión</h2>
          
          {emailNoVerificado && (
            <div style={{ marginBottom: "1rem", textAlign: "center", padding: "10px", backgroundColor: "#fff3cd", borderRadius: "4px" }}>
              <p>Tu correo electrónico no ha sido verificado.</p>
              <Button
                label="Reenviar verificación"
                onClick={handleReenviarVerificacion}
                className="p-button-warning p-button-text"
              />
            </div>
          )}
          
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => onLoginUser(values)}
          >
            {({ handleSubmit, isValid }) => (
              <form onSubmit={handleSubmit} className="p-fluid">
                <div className="p-field">
                  <label htmlFor="username">Nombre de usuario o Email</label>
                  <Field
                    as={InputText}
                    id="username"
                    name="username"
                    className="p-inputtext"
                  />
                  <ErrorMessage
                    name="username"
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
                
                <Button
                  className="p-button mt-3"
                  label="Iniciar Sesión"
                  type="submit"
                  disabled={!isValid}
                  style={{ width: "100%", marginTop: "1rem" }}
                />
                
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                  <Button
                    label="Registrarse"
                    className="p-button-text"
                    onClick={() => navigate("/registro-usuario")}
                    type="button"
                  />
                  
                  <Button
                    label="Reenviar verificación"
                    className="p-button-text"
                    onClick={() => navigate("/reenviar-verificacion")}
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

export default LoginUser;