import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import Spinner from 'react-spinner-material';
import { useNavigate } from 'react-router-dom';
import { TokenCheck } from '../TokenCheck';
import { NavLink } from 'react-router-dom';
import url from '../url';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import dotenv from 'dotenv';

// dotenv.config();

function Login() {

    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        document.title = "Login"
        if (TokenCheck()) {
            navigate("/yourrepo");
        }
    }, [])
    const userForm = {
        username: '',
        pass: '',
    }
    async function authUser(values) {
        try {
            setLoading(true);
            const data = await axios.post({
                method:"post",
                url:`${url}/auth/login`,
                data:values,
                withCredentials: true,
            })
            localStorage.setItem("token", data.data.token);
            navigate("/yourrepo");
            setLoading(false);
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
        <>
            <Formik
                initialValues={
                    userForm
                }
                onSubmit={(values) => {
                    // console.log("1",values);
                    console.log(values);
                    authUser(values);

                }}
                validate={(values) => {
                    const errors = {};
                    if (!values.username.trim()) errors.username = "This field is required";
                    if (!values.pass.trim()) errors.pass = "This field is required";
                    return errors;

                }}
            >
                {({ values, touched, errors }) =>
                    <div className="form">
                        <Form className="row g-3 mx-auto" noValidate>
                            <div className="col-12">
                                <label For="username" className="form-label">Username</label>
                                <Field type="text" className={"form-control" + (touched.username && errors.username ? " is-invalid" : "")} id="username" placeholder="Enter username" name="username" required />
                                <ErrorMessage
                                    component="span"
                                    name="username"
                                    className="text-danger"
                                />
                            </div>
                            <div className="col-12">
                                <label For="pass" className="form-label">Password</label>
                                <Field type="password" className={"form-control" + (touched.pass && errors.pass ? " is-invalid" : "")} placeholder="Enter password" name="pass" id="pass" required />
                                <ErrorMessage
                                    component="span"
                                    name="pass"
                                    className="text-danger"
                                />
                            </div>
                            <div className="col-12">
                                {!loading && <button className="btn btn-primary" type="submit">Login</button>}
                                {loading && <button className="btn btn-primary" disabled>
                                    <Spinner />
                                </button>}
                            </div>
                        </Form>
                        <NavLink to="../register">
                            <span style={{ color: "blue" }}>Not a user?Register</span>
                        </NavLink>
                        <ToastContainer />
                    </div>
                }
            </Formik>
        </>

    )
}

export default Login
