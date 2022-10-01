import React from 'react';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-spinner-material';
import { TokenCheck } from '../TokenCheck';
import url from '../url';
import { ToastContainer, toast } from 'react-toastify';


export default function Register() {
    const obj = {
        username: '',
        pass: '',
    }
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    React.useEffect(() => {
        document.title = "Register";
        if (TokenCheck()) {
            // TokenCheck();
            navigate("/yourrepo");
        }
    }, [])
    async function registerUser(values) {
        var data;
        try {
            setLoading(true);
            data = await axios.post(`${url}/auth/register`, values);
            if (data.status === 200) {
                setLoading(false);
                toast.success("Registartion success...please wait redirecting to login page", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                });
                setTimeout(() => {
                    navigate("/");
                }, 2000)

            }
        }
        catch (e) {
            setLoading(false);
            console.log(e);
            toast.error(e.response.data.message, {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
        }
    }

    return (
        <Formik
            initialValues={obj}
            onSubmit={(values) => {
                // console.log(values);
                registerUser(values);

            }}
            validate={(values) => {
                const errors = {};
                if (!values.username.trim()) errors.username = "This field is required";
                else if (values.username.trim().length < 3) errors.username = "Username should be at least 3 characters";
                if (!values.pass.trim()) errors.pass = "This field is required";
                return errors;
            }}
        >
            {({ values, errors, touched }) =>
                <div className="form">
                    <Form className="row g-3" noValidate>
                        <div className="col-12">
                            <label For="username" className="form-label">Username</label>
                            <Field type="text" class={"form-control" + (touched.username && errors.username ? " is-invalid" : "")} id="username" name="username" placeholder="Enter Username"></Field>
                            <ErrorMessage
                                component="span"
                                name="username"
                                className="text-danger"
                            />
                        </div>
                        <div className="col-12">
                            <label for="pass" className="form-label">Password</label>
                            <Field type="password" class={"form-control" + (touched.pass && errors.pass ? " is-invalid" : "")} id="pass" name="pass" placeholder="Enter password"></Field>
                            <ErrorMessage
                                component="span"
                                name="pass"
                                className="text-danger"
                            />
                        </div>
                        <div className="col-12">
                            {!loading && <button className="btn btn-primary" type="submit">Register</button>}
                            {loading && <button className="btn btn-primary" disabled>
                                <Spinner />
                            </button>}
                        </div>
                    </Form>
                    <ToastContainer />
                </div>
            }
        </Formik>
    )
}
