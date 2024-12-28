import { Formik, Field, ErrorMessage } from "formik";
import { useRef } from "react";
import { Toast } from 'primereact/toast';
import * as Yup from 'yup';

const LoginUser = () => {
    const toast = useRef(null);

    const onLoginUser = async (values) => {
        const bodyLoginUser = btoa(`${values.username}:${values.password}`);

        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                "Authorization": `Basic ${bodyLoginUser}`
            }
        });

        if (!response.ok) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Inicio de sesión fallido', life: 3000 });
            console.log("Error en la solicitud");
            return;
        }
        
        const data = await response.json();
        localStorage.setItem('token', JSON.stringify(data.Token));
        
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Inicio de sesión exitoso', life: 3000 });
        console.log(data.Token);
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('El nombre de usuario es requerido'),
        password: Yup.string().required('La contraseña es requerida'),
    });

    return (
        <>
            <Toast ref={toast} />
            <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => onLoginUser(values)}
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
                            LOGIN
                        </button>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default LoginUser;
