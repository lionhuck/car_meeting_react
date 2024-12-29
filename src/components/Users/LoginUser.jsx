import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { Formik, Field, ErrorMessage } from 'formik';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import * as Yup from 'yup';


const LoginUser = () => {
  const toast = useRef(null);
  const navigate = useNavigate(); // Hook para navegar a otras páginas

  const onLoginUser = async (values) => {
    const bodyLoginUser = btoa(`${values.username}:${values.password}`);

    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        Authorization: `Basic ${bodyLoginUser}`,
      },
    });

    if (!response.ok) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Inicio de sesión fallido",
        life: 3000,
      });
      console.log("Error en la solicitud");
      return;
    }

    const data = await response.json();
    localStorage.setItem("token", JSON.stringify(data.token));

    toast.current.show({
      severity: "success",
      summary: "Éxito",
      detail: "Inicio de sesión exitoso",
      life: 3000,
    });
    console.log(data.Token);
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("El nombre de usuario es requerido"),
    password: Yup.string().required("La contraseña es requerida"),
  });

  // Función para redirigir a la página de registro
  const redirectToRegistro = () => {
    navigate("/nuevo-usuario"); // Redirige a la página de registro
  };

  return (
    <div className="p-d-flex p-jc-center p-ai-center">
      <div className="p-card p-shadow-3" style={{ width: "400px", padding: "2rem" }}>
        <Toast ref={toast} />
        <h2 className="p-text-center">Iniciar Sesión</h2>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => onLoginUser(values)}
        >
          {({ handleSubmit, isValid }) => (
            <form onSubmit={handleSubmit} className="p-fluid">
              <div className="p-field">
                <label htmlFor="username">Nombre de usuario</label>
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
            <div className='card flex justify-content-center'></div>
              <Button
                label="Iniciar Sesión"
                type="submit"

                disabled={!isValid}
                style={{ width: "100%" }}
              />

              <Button
                label="Registrarse"
                className="p-button p-mt-3 p-button-secondary"
                style={{ width: "100%" }}
                onClick={redirectToRegistro} // Llama a la función para redirigir
              />
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginUser;
