import { Formik, Field, ErrorMessage } from "formik";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import * as Yup from "yup";

const RegistroUsuario = () => {
  const [mensaje, setMensaje] = useState("");
  const [generos, setGeneros] = useState([]);
  const toast = useRef(null);
  const navigate = useNavigate();
  
  // Función para manejar el envío del formulario
  const onSubmit = async (values) => {
    try {
      // 1. Registramos al usuario
      const response = await fetch("http://127.0.0.1:5000/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        setMensaje(data.mensaje || "Usuario registrado exitosamente");
        
        // 2. Si el registro es exitoso, hacemos login automáticamente
        await realizarLoginAutomatico(values.nombre_usuario, values.password);
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

  // Función para realizar el login automático después del registro
  const realizarLoginAutomatico = async (username, password) => {
    try {
      const bodyLoginUser = btoa(`${username}:${password}`);

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
          detail: "Inicio de sesión automático fallido. Por favor, inicie sesión manualmente.",
          life: 3000,
        });
        // Redirigir a la página de login para que el usuario inicie sesión manualmente
        navigate('/login');
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", JSON.stringify(data.token));

      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "¡Registro e inicio de sesión exitosos!",
        life: 3000,
      });
      
      // Redirigir a la página principal o dashboard
      navigate('/viajes'); // Ajusta esta ruta según tu aplicación
    } catch (error) {
      console.error("Error en login automático:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al iniciar sesión automáticamente",
        life: 3000,
      });
      navigate('/login');
    }
  };

  // Obtener los géneros al cargar el componente
  useEffect(() => {
    const obtenerGeneros = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/generos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Géneros obtenidos:", data);
          setGeneros(data);
        } else {
          console.error("Error al obtener géneros:", await response.text());
        }
      } catch (error) {
        console.error("Error al obtener los géneros:", error);
      }
    };
    
    obtenerGeneros();
  }, []);

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
    id_genero: Yup.number().required("El género es obligatorio"),
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
              id_genero: "",
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ handleSubmit, isValid }) => (
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
                  <label htmlFor="id_genero">Género</label>
                  <Field
                    as="select"
                    id="id_genero"
                    name="id_genero"
                    className="p-inputtext"
                  >
                    <option value="">Seleccione un género</option>
                    {generos && generos.length > 0 ? (
                      generos.map((genero) => (
                        <option key={genero.id} value={genero.id}>
                          {genero.nombre}
                        </option>
                      ))
                    ) : (
                      <option disabled>Cargando géneros...</option>
                    )}
                  </Field>
                  <ErrorMessage
                    name="id_genero"
                    component="small"
                    style={{ color: "red" }}
                  />
                </div>

                <Button
                  label="Registrarse"
                  type="submit"
                  className="p-button p-mt-3"
                  disabled={!isValid}
                  style={{ width: "100%" }}
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