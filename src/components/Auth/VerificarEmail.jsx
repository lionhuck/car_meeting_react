import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
const API_URL = import.meta.env.VITE_API_URL;

const VerificarEmail = () => {
  const { token } = useParams(); 
  const [verificando, setVerificando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [exito, setExito] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;
    
    const verificarEmail = async () => {
      try {
        const response = await fetch(`${API_URL}/verificar-email/${token}`, {
          method: "GET",
        });

        const data = await response.json();
        
        setVerificando(false);
        
        if (response.ok) {
          setExito(true);
          setMensaje(data.mensaje || "Email verificado exitosamente");
          toast.current.show({
            severity: "success",
            summary: "Verificación Exitosa",
            detail: "Tu correo electrónico ha sido verificado correctamente",
            life: 3000,
          });
        } else {
          setExito(false);
          setMensaje(data.mensaje || "Error al verificar el email");
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: data.mensaje || "No se pudo verificar el correo electrónico",
            life: 3000,
          });
        }
      } catch (error) {
        setVerificando(false);
        setExito(false);
        setMensaje("Error al conectar con el servidor");
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error al conectar con el servidor",
          life: 3000,
        });
      }
    };

    if (token) {
      verificarEmail();
    } else {
      setVerificando(false);
      setExito(false);
      setMensaje("Token no proporcionado");
    }
  }, [token]);

  const handleReenviarVerificacion = () => {
    navigate("/reenviar-verificacion");
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      padding: "1rem"
    }}>
      <h1 style={{ marginBottom: "1rem", fontSize: "1.75rem" }}>CAR MEETING</h1>
      <div className="p-d-flex p-jc-center p-ai-center" style={{ width: "100%" }}>
        <div className="p-card p-shadow-3" style={{ 
          width: "100%",
          maxWidth: "500px",
          padding: "1.5rem"
        }}>
          <Toast ref={toast} />
          <h2 className="p-text-center" style={{ fontSize: "1.5rem" }}>Verificación de Email</h2>
          
          {verificando ? (
            <div className="p-text-center p-mb-3">
              <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
              <p>Verificando tu email...</p>
            </div>
          ) : (
            <>
              <div className="p-text-center p-mb-3" style={{
                marginBottom: "1.5rem",
                color: exito ? "var(--success-color)" : "var(--danger-color)",
                fontSize: "1rem"
              }}>
                {mensaje}
              </div>
              
              <div className="p-text-center" style={{ marginBottom: "1rem" }}>
                {exito ? (
                  <Button
                    label="Iniciar Sesión"
                    onClick={() => navigate("/login")}
                    className="p-button"
                    style={{ width: "100%" }}
                  />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <Button
                      label="Reenviar Verificación"
                      onClick={handleReenviarVerificacion}
                      className="p-button-outlined"
                      style={{ width: "100%" }}
                    />
                    <Button
                      label="Volver al Inicio"
                      onClick={() => navigate("/login")}
                      className="p-button"
                      style={{ width: "100%" }}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificarEmail;