import React from 'react';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-spinner-material';
import url from '../url'
import { TokenCheck } from '../TokenCheck';

import { ToastContainer, toast } from 'react-toastify';


export default function Register() {
    const obj = {
        name: '',
    }
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    React.useEffect(() => {
        if (!TokenCheck()) {
            // TokenCheck();
            navigate("/");
        }
        document.title="Add Repo"
    }, [])
    async function registerUser(values) {
        var data;
        try {
            setLoading(true);
            data = await axios({
                method: "POST",
                url: `${url}/repo/createrepo`,
                data: values,
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (data.status === 200) {
                setLoading(false);
                toast.success("Registartion success...please wait redirecting to Repo page", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                });
                setTimeout(() => {
                    navigate("/yourrepo");
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
                if (!values.name.trim()) errors.username = "This field is required";
                return errors;
            }}
        >
            {({ values, errors, touched }) =>
                <div className="form">
                    <Form className="row g-3" noValidate>
                        <div className="col-12">
                            <label For="name" className="form-label">Repo name</label>
                            <Field type="text" class={"form-control" + (touched.name && errors.name ? " is-invalid" : "")} id="name" name="name" placeholder="Enter repo rname"></Field>
                            <ErrorMessage
                                component="span"
                                name="name"
                                className="text-danger"
                            />
                        </div>
                        <div className="col-12">
                            {!loading && <button className="btn btn-primary" type="submit">Add repo</button>}
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
