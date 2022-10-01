import React, { useEffect, useState } from 'react'
import url from '../url';
import axios from 'axios';
import { TokenCheck } from '../TokenCheck';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';

const DeleteBranch = () => {
    const navigate = useNavigate();
    const { repoId } = useParams();
    const [loading, setLoading] = useState(false);
    const [dLoading, setDLoading] = useState(false);
    const [error, setError] = useState(false);
    let [branches, setBranches] = useState([]);

    async function getBranches(repoId) {
        try {
            setLoading(true);
            const data = await axios({
                method: 'get',
                url: `${url}/branches/getSelectiveBranch?repoId=${repoId}`,
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            branches = data.data;
            setBranches(branches);
            setError(false);
            setLoading(false);
        }
        catch (e) {
            console.log(e);
            setError(e.message);
            setLoading(false);
        }
    }
    async function deleteBranch(branchId) {
        try {
            setDLoading(true);
            const data = await axios({
                method: 'delete',
                url: `${url}/branches/deleteBranch`,
                data: {
                    branchId: branchId
                },
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDLoading(false);
            setError(false);
            setBranches(branches.filter((branch)=>branch._id!==branchId))
            toast.success("Branch deleted successfully", {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            })
        }
        catch (e) {
            toast.error("Something went wrong", {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            })
            setDLoading(false);
        }
    }
    useEffect(() => {
        if (!TokenCheck()) {
            navigate("/");
            return;
        }
        getBranches(repoId);
    }, [])
    return (
        <div className="container-fluid m-2">
            {loading && <LoadingIcon />}
            {error && <span className='text-danger'>Something went wrong...please refresh</span>}
            {branches.length === 0 && !loading && !error ? <span>No branches present</span> : branches.map((branch) => <div key={branch._id} className="d-flex justify-content-between m-2"><div>{branch.name}</div>{dLoading?<div><CircularProgress/></div>: <div style={{ cursor: "pointer" }} onClick={() => deleteBranch(branch._id)}>{branch.name!=='main'&&<DeleteIcon/>}</div>}</div>)}
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

export default DeleteBranch
