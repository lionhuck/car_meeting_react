import { Formik, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import * as Yup from 'yup';

const RegistroUsuario = () => {
    const [mensaje, setMensaje] = useState('');

    // Función para manejar el envío del formulario
    const onSubmit = async (values) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/registro", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();
            if (response.ok) {
                setMensaje(data.mensaje || 'Usuario registrado exitosamente');
            } else {
                setMensaje(data.mensaje || 'Hubo un error al registrar el usuario');
            }
        } catch (error) {
            setMensaje('Error al conectar con el servidor');
        }
    };

    const validationSchema = Yup.object().shape({
        nombre: Yup.string().min(2).max(50).required("El nombre es obligatorio"),
        apellido: Yup.string().min(2).max(50).required("El apellido es obligatorio"),
        nombre_usuario: Yup.string()
            .min(3).max(50)
            .matches(/^[a-zA-Z0-9_]+$/, "El nombre de usuario solo puede contener letras, números y guiones bajos")
            .required("El nombre de usuario es obligatorio"),
        email: Yup.string().email("Formato de email inválido").required("El email es obligatorio"),
        password: Yup.string()
            .min(8)
            .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "La contraseña debe contener letras y números")
            .required("La contraseña es obligatoria"),
        id_genero: Yup.number().min(1).required("El género es obligatorio"),
    });

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
            <div className="p-d-flex p-jc-center p-ai-center">
                <div className="p-card p-shadow-3" style={{ width: "400px", padding: "2rem" }}>
                    <h2 className="p-text-center">Registrarse</h2>
                    {mensaje && <div className="p-text-center p-mb-3">{mensaje}</div>}
                    <Formik
                        initialValues={{
                            nombre: '',
                            apellido: '',
                            nombre_usuario: '',
                            email: '',
                            password: '',
                            id_genero: 1,
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
                                        <option value="1">Masculino</option>
                                        <option value="2">Femenino</option>
                                        <option value="3">Otro</option>
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
