import React from 'react';
import axios from 'axios';
import { useNavigate, useParams, NavLink, useSearchParams } from 'react-router-dom';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import CircularProgress from '@mui/material/CircularProgress';
import url from '../url';
import { TokenCheck } from '../TokenCheck';

const Repo = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [oLoading, setoLoading] = React.useState(false);
    const [oError, setoError] = React.useState(false);
    const [oData, setoData] = React.useState();
    const [files, setFiles] = React.useState();
    const [delLoading, setDelLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    let { repoId } = useParams();
    async function getBranch() {
        try {
            setoLoading(true);
            const data = await axios({
                method: "GET",
                url: `${url}/branches/getBranch/${repoId}`,
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setoLoading(false);
            setoData(data.data);
            setError(false);
        }
        catch (e) {
            setError(true);
            setoLoading(false);
            console.log(e);
        }
    }
    async function getFiles(branchName = "main") {
        try {
            setLoading(true);
            const data = await axios({
                method: 'GET',
                url: `${url}/branches/getfiles/${repoId}?name=${branchName}`,
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setLoading(false);
            setFiles(data.data);
            console.log("files:", data.data);
            setError(false);
        }
        catch (e) {
            setLoading(false);
            setError(true);
            console.log(e);
        }
    }
    React.useEffect(() => {
        if (!TokenCheck()) {
            console.log(123);
            navigate("/");
            return;
        }
        getBranch();
        getFiles();
        document.title = "Files";
    }, [])
    return (
        <div className="container-fluid m-2">
            <div className="utilities d-flex m-4">
                <select class="form-select" onChange={(e) => {
                    if (e.target.value === 'navigate') {
                        navigate(`/${repoId}/addbranch`);
                    }
                    else if(e.target.value==='delete')
                        navigate(`/repo/${repoId}/deleteBranch`);
                    else {
                        getFiles(e.target.value)
                    }
                }} aria-label="Default select example" disabled={oData ? false : true}>
                    {oLoading && <option selected><LoadingIcon /></option>}
                    {oError && <option><span className="text-danger">Something went wrong</span></option>}
                    {oData && oData.length !== 0 && oData.map((o, ind) => {
                        if (ind === 0)
                            return <option className="d-flex justify-content-between" selected value="main"><div style={{ cursor: "pointer" }}>{o.name}</div></option>
                        return <option className='d-flex justify-content-between' value={o.name}><div style={{ cursor: "pointer" }}>{o.name}</div></option>
                    })}
                    {!oError && <option value={"navigate"} style={{ cursor: "pointer" }}>Create new branch</option>}
                    {!oError && <option value={"delete"} style={{ cursor: "pointer" }}>Delete branch</option>}
                </select>
            </div>
            <div className="files">
                {loading && <LoadingIcon />}
                {error && <div style={{ color: "gray" }} className="mx-auto not-found">
                    <span className="text-danger">Something went wrong<SentimentDissatisfiedIcon />
                        Please refresh the page</span>
                </div>}
                {files && files.length === 0 && <div style={{ color: "gray" }} className="mx-auto not-found">
                    <span>No files present?? <SentimentDissatisfiedIcon /> <NavLink to={`/repo/${repoId}/uploadFile`}><span style={{ color: "blue" }}>Click here to add your first file</span></NavLink></span>
                </div>}
                {files && files.length !== 0 && <div className="m-2 d-flex justify-content-between">
                    <div><NavLink to={`uploadFile`} style={{ color: "blue" }}>Upload new file</NavLink></div>
                    <div><NavLink to={`pull`} style={{ color: "blue" }}>Create Pull request</NavLink></div>
                </div>}
                {files && files.length !== 0 && files.map((file) => {
                    return <><div className="d-flex justify-content-between mt-3" style={{ overflow: "auto" }}><div style={{ cursor: "pointer" }} onClick={() => navigate(`/file/${file._id}`)} key={file._id}>{file.file_name}</div> </div><hr /></>
                })}
            </div>
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

export default Repo
