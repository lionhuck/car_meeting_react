import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import axios from "axios";

const EditarPerfil = () => {
  const [user, setUser] = useState({});
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.put("/api/auth/edit", values);
      toast.current.show({
        severity: "success",
        summary: "Perfil actualizado",
        detail: response.data.message,
        life: 3000,
      });
      navigate("/profile");
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Error al actualizar perfil",
        detail: error.response.data.message,
        life: 3000,
      });
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es requerido"),
    email: Yup.string()
      .email("El email debe ser válido")
      .required("El email es requerido"),
    password: Yup.string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .required("La contraseña es requerida"),
  });

  return (
    <div className="flex flex-column gap-3">
      <Toast ref={toast} />
      <Formik
        initialValues={{
          name: user.name,
          email: user.email,
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleSubmit, values, errors }) => (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-column gap-2">
              <label>
                Nombre:
                <Field
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                />
              </label>
              <ErrorMessage name="name" component="div" />
              <label>
                Email:
                <Field
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                />
              </label>
              <ErrorMessage name="email" component="div" />
              <label>
                Contraseña:
                <Password
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  toggleMask
                />
              </label>
              <ErrorMessage name="password" component="div" />
            </div>
            <Button type="submit" label="Actualizar perfil" />
          </form>
        )}
      </Formik>
    </div>
  );
};

export default EditarPerfil;
