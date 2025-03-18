import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Field, ErrorMessage } from 'formik';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import * as Yup from 'yup';

const API_URL = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const { token } = useParams();

  const onResetPassword = async (values) => {
    try {
      const response = await fetch(`${API_URL}/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: values.password,
          confirm_password: values.confirm_password
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.current.show({
          severity: "success",
          summary: "Contraseña Actualizada",
          detail: data.mensaje || "Tu contraseña ha sido actualizada exitosamente",
          life: 5000,
        });
        // Redirigir al usuario al login después de unos segundos
        setTimeout(() => navigate('/login'), 3000);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.mensaje || "No se pudo actualizar la contraseña",
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
    password: Yup.string()
      .required("La contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        "La contraseña debe contener letras y números"
      ),
    confirm_password: Yup.string()
      .required("La confirmación de contraseña es requerida")
      .oneOf([Yup.ref('password'), null], "Las contraseñas deben coincidir"),
  });

  if (!token) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h2>Token inválido</h2>
        <p>No se ha proporcionado un token válido para restablecer la contraseña.</p>
        <Button
          label="Volver al Login"
          onClick={() => navigate("/login")}
        />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <h1 style={{ marginBottom: "1rem" }}>CAR MEETING</h1>
      <div className="p-d-flex p-jc-center p-ai-center">
        <div className="p-card p-shadow-3" style={{ width: "400px", padding: "2rem" }}>
          <Toast ref={toast} />
          <h2 className="p-text-center">Restablecer Contraseña</h2>
          <p className="p-text-center">
            Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
          </p>
          <Formik
            initialValues={{ password: "", confirm_password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => onResetPassword(values)}
          >
            {({ handleSubmit, isValid }) => (
              <form onSubmit={handleSubmit} className="p-fluid">
                <div className="p-field">
                  <label htmlFor="password">Nueva Contraseña</label>
                  <Field
                    as={InputText}
                    id="password"
                    name="password"
                    type="password"
                    className="p-inputtext"
                  />
                  <ErrorMessage
                    name="password"
                    component="small"
                    style={{ color: "red" }}
                  />
                </div>
                
                <div className="p-field">
                  <label htmlFor="confirm_password">Confirmar Contraseña</label>
                  <Field
                    as={InputText}
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    className="p-inputtext"
                  />
                  <ErrorMessage
                    name="confirm_password"
                    component="small"
                    style={{ color: "red" }}
                  />
                </div>
                
                <Button
                  className="p-button mt-3"
                  label="Restablecer Contraseña"
                  type="submit"
                  disabled={!isValid}
                  style={{ width: "100%", marginTop: "1rem" }}
                />
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;