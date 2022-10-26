import React from 'react'
import axios from 'axios';
import { TokenCheck } from '../TokenCheck'
import { useNavigate, NavLink, useParams } from 'react-router-dom';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import url from '../url'

const File = () => {
    const type = ['jpg', 'png', 'jpeg']
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [file, setFile] = React.useState();
    const [error, setError] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [delLoading, setDelLoading] = React.useState(false);
    let { fileId } = useParams();
    async function deleteFile(fileId) {
        try {
            setDelLoading(true);
            const data = await axios({
                method: "DELETE",
                url: `${url}/branches/deleteFile`,
                data: {
                    fileId: fileId
                },
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDelLoading(false);
            navigate(`/repo/${data.data.repoId}`)
            setError(false);
        }
        catch (e) {
            console.log(e);
            setDelLoading(false);
            setError(true);
        }
    }
    async function editFile(fileId, file_data) {
        console.log("Info",fileId,file_data);
        try {
            const data = await axios({
                method: "PUT",
                url: `${url}/branches/editFiles`,
                data: {
                    fileId: fileId,
                    file_data: file_data
                },
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            toast.success("Changes made to file successfully", {
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
            try {
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
            catch (e) {
                alert('something went wrong..please refresh the page');
            }
        }
    }
    async function getFile() {
        try {
            setLoading(true);
            document.title = "Loading..."
            const data = await axios({
                method: "GET",
                url: `${url}/branches/getFile/${fileId}`,
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setLoading(false);
            setFile(data.data);
            document.title = data.data.file_name
            console.log(data.data);
            setError(false);
        }
        catch (e) {
            console.log(e);
            setLoading(false);
            setError(true);
        }
    }
    React.useEffect(() => {
        if (!TokenCheck()) {
            console.log(123);
            navigate("/");
            return;
        }
        getFile();
    }, [])
    return (
        <div className="file_display container-fluid text-center mt-3">
            {loading && <LoadingIcon info="Fetching file..please wait" />}
            {error && <div style={{ color: "gray" }} className="mx-auto not-found">
                <span className="text-danger">Something went wrong<SentimentDissatisfiedIcon />
                    Please refresh the page</span>
            </div>}
            {file && Object.keys(file) !== 0 ? (type.includes(file.file_type) ? <DisplayImage file={file} deleteFile={deleteFile} delLoading={delLoading} setDelLoading={setDelLoading} /> : <DisplayText editFile={editFile} edit={edit} setEdit={setEdit} file={file} setFile={setFile} deleteFile={deleteFile} delLoading={delLoading} setDelLoading={setDelLoading} />) : null}
            <ToastContainer/>
        </div>
    )
}

function DisplayImage({ file, deleteFile, delLoading }) {
    return <div style={{ overflow: "auto" }}>
        <img style={{ height: "400px", width: "500px" }} src={`data:image/png;base64,${file.file_data}`} />
        {file.hasAccess && <div className='mx-auto'>
            <hr />{delLoading ? <CircularProgress info="please wait" /> : <span style={{ cursor: "pointer" }} onClick={() => deleteFile(file._id)}><DeleteIcon /></span>}
        </div>}
        <div><hr />{file.file_name}<hr /></div>
    </div>
}

function DisplayText({ file, deleteFile, delLoading, edit, setEdit, setFile,  editFile }) {
    return <div style={{ overflow: "auto" }}>
        {file.hasAccess && <div className='mx-auto'>
            {<span style={{ cursor: "pointer" }} onClick={() => { edit = !edit; setEdit(edit) }}>{edit ? <button type="button" className="btn btn-secondary m-2" onClick={() =>editFile(file._id,file.file_data)}>save edit</button> : <EditIcon />}</span>}
        </div>}
        <textarea onChange={(e) => { file.file_data = e.target.value; setFile({ ...file }) }} readOnly={edit ? false : true} style={{ wordWrap: "pre", height: "400px", width: "100%" }} value={file.file_data} />
        {file.hasAccess && <div className='mx-auto'>
            <hr />{delLoading ? <CircularProgress info="please wait" /> : <span style={{ cursor: "pointer" }} onClick={() => deleteFile(file._id)}><DeleteIcon /></span>}
        </div>}
        <div><hr />{file.file_name}<hr /></div>
    </div>
}

function LoadingIcon({ info }) {
    return (
        <div className="prod_load_spinner">
            <CircularProgress />
            <div style={{ marginTop: "4px" }}>
                {info}
            </div>
        </div>
    )
}

export default File
