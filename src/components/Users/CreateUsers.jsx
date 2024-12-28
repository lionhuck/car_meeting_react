import { Formik, Field, ErrorMessage } from "formik";
import { useRef } from "react";
import { Toast } from 'primereact/toast';
import * as Yup from 'yup';

const CreateUser = () => {
    const toast = useRef(null);

    const RegisterUser = async (values) => {
        const token = JSON.parse(localStorage.getItem('token'));

        const bodyRegisterUser = {
            nombre: values.username,
            password: values.password
        };

        const response = await fetch('http://localhost:5000/registro', {
            method: 'POST',
            body: JSON.stringify(bodyRegisterUser),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el usuario', life: 3000 });
            console.log("Error en la solicitud");
            return;
        }

        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente', life: 3000 });
        console.log("Usuario creado:", bodyRegisterUser);
    };

    const ValidationSchema = Yup.object().shape({
        password: Yup.string()
            .required("Es un campo requerido")
            .min(5, 'La contraseña debe tener al menos 5 caracteres'),
        username: Yup.string()
            .required("El nombre de usuario es requerido")
            .min(5, 'El nombre de usuario debe tener al menos 5 caracteres')
            .max(15, 'El nombre de usuario no debe tener más de 15 caracteres')
    });

    return (
        <>
            <Toast ref={toast} />
            <Formik
                initialValues={{ password: '', username: '' }}
                validationSchema={ValidationSchema}
                onSubmit={(values) => RegisterUser(values)}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isValid
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Nombre de usuario:</label>
                            <Field
                                type="text"
                                name="username"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.username}
                            />
                            <ErrorMessage name="username" component="div" style={{ color: 'red' }} />
                        </div>

                        <div>
                            <label>Contraseña:</label>
                            <Field
                                type="password"
                                name="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                            />
                            <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
                        </div>

                        <button type="submit" disabled={!isValid}>
                            Crear Usuario
                        </button>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default CreateUser;
