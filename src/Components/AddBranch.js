import React from 'react';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import axios from 'axios';
import { useNavigate ,useParams} from 'react-router-dom';
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
        document.title = "Add Branch";
    }, [])
    const {repoId}=useParams();
    async function registerUser(values) {
        var data;
        try {
            setLoading(true);
            data = await axios({
                method: "POST",
                url: `${url}/branches/createbranch`,
                data: values,
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (data.status === 200) {
                setLoading(false);
                toast.success("Registration success...please wait redirecting to main branch page page", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                });
                setTimeout(() => {
                    navigate(`/repo/${repoId}`);
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
                values.repo=repoId
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
                            <label For="name" className="form-label">name</label>
                            <Field type="text" class={"form-control" + (touched.name && errors.name ? " is-invalid" : "")} id="name" name="name" placeholder="Enter branch rname"></Field>
                            <ErrorMessage
                                component="span"
                                name="name"
                                className="text-danger"
                            />
                        </div>
                        <div className="col-12">
                            {!loading && <button className="btn btn-primary" type="submit">Add branch</button>}
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
