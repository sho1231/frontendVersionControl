import React from 'react'
import url from '../url'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { TokenCheck } from '../TokenCheck';
import { ToastContainer, toast } from 'react-toastify';
import Spinner from 'react-spinner-material';

const AddFile = () => {
    const navigate = useNavigate();
    const { repoId } = useParams();
    // console.log(useParams);
    let [files, setFiles] = React.useState([]);
    let [branch, setBranch] = React.useState('');
    let [branches, setBranches] = React.useState([]);
    let [oLoading, setoLoading] = React.useState(false);
    let [loading, setLoading] = React.useState(false);
    let formData = new FormData();
    formData.append("branchId", branch);
    async function getBranches() {
        try {
            setoLoading(true);
            const data = await axios({
                method: "GET",
                url: `${url}/branches/getSelectiveBranch?repoId=${repoId}`,
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setoLoading(false);
            branches = data.data;
            setBranches(branches);
        }
        catch (e) {
            setoLoading(false);
            console.log(e);
        }
    }
    async function uploadFile() {
        try {
            files.map((file) => {
                formData.append("file", file);
            })
            console.log("branch", branch);
            console.log("files", files.length);
            setLoading(true);
            if (files.length === 0 || branch === '') {
                toast.error("Atleast 1 file should be uploaded and any one branch should be selected", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                });
                return;
            }
            const data = await axios({
                method: "POST",
                url: `${url}/branches/upload`,
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            setLoading(false);
            /*toast.success("File upload successfully", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,   
            })*/
            navigate(`/repo/${repoId}`)
        }
        catch (e) {
            setLoading(false);
            console.log(e);
            toast.error("Something went wrong", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
        }
    }
    React.useEffect(() => {
        if (!TokenCheck()) {
            navigate("/");
            return;
        }
        getBranches();
    }, [])
    return (
        <div className="mt-4 text-center">
            <div className="container-fluid p-3 w-25 d-flex justify-content-center align-items-center" style={{ border: "1px solid black" }}>
                <div><input type="file" name="file" disabled={oLoading ? true : false} onChange={(e) => {
                    // console.log(e.target.files);
                    // console.log(Object.entries(e.target.files));
                    let temp_files = Object.entries(e.target.files);
                    temp_files = temp_files.map((file) => file[1]);
                    files = [...files, ...temp_files];
                    setFiles(files);
                    console.log("123 final files", files)
                }} multiple /></div>
            </div>
            {files.map((file) => <div><hr />{file.name} is ready for upload <hr /></div>)}
            <div className="select_branch mt-2">
                <select onClick={(e) => {
                    branch = e.target.value;
                    console.log("1231212", e.target.value);
                    setBranch(branch);
                }}>
                    {oLoading && <option value='' disabled>Please wait while we fetch your branches</option>}
                    {branches.length !== 0 && <option value=''>Select your branch</option>}
                    {branches.length !== 0 && branches.map((branch, ind) => {
                        if (ind === 0)
                            return <option key={branch._id} value={branch._id}>{branch.name}</option>
                        return <option key={branch._id} value={branch._id}>{branch.name}</option>
                    })}
                </select>
            </div>
            <div className="mt-3">
                <button type="button" onClick={uploadFile} className='btn btn-secondary'>upload</button>
            </div>
            <ToastContainer />
        </div>
    )
}

export default AddFile
