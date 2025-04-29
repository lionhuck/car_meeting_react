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
  const [showPassword, setShowPassword] = useState(false);
  
  const onLoginUser = async (values) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,  // Asegúrate de que coincida con la clave esperada por el backend
          password: values.password,
        }),
      });
  
      const data = await response.json();

      if (!response.ok) {
        // Verificar si el error es porque el email no está verificado
        if (data.mensaje && data.mensaje.includes("Correo electrónico no verificado")) {
          setEmailNoVerificado(values.email);
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
      
      const pendingViajeId = localStorage.getItem("pendingViajeId");
      
      if (pendingViajeId) {
        localStorage.removeItem("pendingViajeId");
        
        // Verificar que el viaje aún existe antes de redirigir
        try {
          const viajeResponse = await fetch(`${API_URL}/viajes/compartir/${pendingViajeId}`);
          if (viajeResponse.ok) {
            navigate(`/viaje-compartido/${pendingViajeId}`);
            return; // Importante: salir para evitar doble redirección
          }
        } catch (error) {
          console.error('Error verificando viaje:', error);
        }
        
        // Si hay error o el viaje ya no existe, redirigir a otra página
        toast.current.show({
          severity: "warn",
          summary: "Viaje no disponible",
          detail: "El viaje al que intentabas unirte ya no está disponible",
          life: 3000,
        });
      }
      
      // Redirección normal si no hay viaje pendiente
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
    email: Yup.string().required("El email es requerido"),
    password: Yup.string().required("La contraseña es requerida"),
  });

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      padding: "0 1rem" // Añadir padding horizontal
    }}>
      <h1 style={{ marginBottom: "1rem", fontSize: "1.75rem" }}>CAR MEETING</h1>
      <div className="p-d-flex p-jc-center p-ai-center" style={{ width: "100%" }}>
        <div className="p-card p-shadow-3" style={{ 
          width: "100%", 
          maxWidth: "400px",
          padding: "1.5rem" // Reducir padding
        }}>
          <Toast ref={toast} />
          <h2 className="p-text-center">Iniciar Sesión</h2>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => onLoginUser(values)}
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

                <div className="p-field">
                  <label htmlFor="password">Contraseña</label>
                  <div className="p-inputgroup">
                    <Field
                      as={InputText}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="p-inputtext"
                    />
                    <span
                      className="p-inputgroup-addon"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i
                        className={`pi ${
                          showPassword ? "pi-eye-slash" : "pi-eye"
                        }`}
                      />
                    </span>
                  </div>
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

                {/* Agregar el enlace de texto para olvidar contraseña */}
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/solicitar-reset");
                    }}
                    style={{ color: "#2196F3", textDecoration: "none" }}
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
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