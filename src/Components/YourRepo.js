import React from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, NavLink } from 'react-router-dom';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import url from '../url'
import { TokenCheck } from '../TokenCheck';
import { ToastContainer, toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';


const YourRepo = () => {
    let [repos, setRepos] = React.useState();
    let [loading, setLoading] = React.useState(false);
    let [dLoading, setDLoading] = React.useState(false);
    let [error, setError] = React.useState(false)
    // window.location.reload();
    async function deleteRepos(id) {
        try {
            console.log("delete");
            setDLoading(true);
            const data = await axios({
                method: 'delete',
                url: `${url}/repo/delete`,
                data: {
                    id: id
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDLoading(false);
            setRepos(repos.filter((repo) => repo._id !== id));
            toast.success("Repo deleted successfully", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            })
        }
        catch (e) {
            setDLoading(false);
            toast.error("Something went wrong", {
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
    async function getRepos() {
        try {
            setLoading(true);
            const data = await axios({
                method: "GET",
                url: `${url}/repo/getrepo`,
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setRepos();
            setRepos(data.data);
            setError(false);
            setLoading(false);
        }
        catch (e) {
            console.log(e);
            setLoading(false);
            setError(true);
        }
    }
    const navigate = useNavigate();
    React.useEffect(() => {
        if (!TokenCheck()) {
            console.log(123);
            navigate("/");
            return;
        }
        getRepos();
        if (!window.location.hash) {
            window.location = window.location + '#landingpage';
            window.location.reload();
        }
        document.title = "Your repos"
    }, [])
    return (
        <div className="container-fluid mt-2 d-flex flex-row">
            {loading && <LoadingIcon />}
            {error && <div style={{ color: "gray" }} className="mx-auto not-found">
                <span className="text-danger">Something went wrong<SentimentDissatisfiedIcon />
                    Please refresh the page</span>
            </div>}
            {repos && repos.length === 0 && <div style={{ color: "gray" }} className="mx-auto not-found">
                <span>No Repos present?? <SentimentDissatisfiedIcon /> <NavLink to="/addrepo"><span style={{ color: "blue" }}>Click here to add your first repo</span></NavLink></span>
            </div>}
            {repos && repos.length !== 0 && repos.map((repo) => <div className="card m-2 text-center" style={{ "width": "18rem" }}>
                <div className="card-body">
                    <h5 onClick={() => {
                        console.log(repo);
                        navigate(`/repo/${repo._id}`);
                    }} style={{ cursor: "pointer" }} class="card-title">{repo.name}</h5>
                    <p className="card-text">Total Branches:{repo.total_branches}</p>
                    <p onClick={() => deleteRepos(repo._id)}>{dLoading ? <CircularProgress /> : <DeleteIcon />}</p>
                </div>
            </div>)}
            <ToastContainer/>
        </div>
    )
}
function LoadingIcon() {
    return (
        <div className="prod_load_spinner">
            <CircularProgress />
            <div style={{ marginTop: "4px" }}>
                Fetching your repos please wait...
            </div>
        </div>
    )
}

function Error() {
    return <div style={{ color: "gray" }} className="mx-auto not-found">
        <span className="text-danger">Something went wrong<SentimentDissatisfiedIcon />
            Please refresh the page</span>
    </div>
}

export default YourRepo
