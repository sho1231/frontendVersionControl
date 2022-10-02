import React, { useState, useEffect } from 'react';
import url from '../url';
import axios from 'axios';
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
import { useNavigate, useParams } from 'react-router-dom';
import { TokenCheck } from '../TokenCheck';
import { ToastContainer, toast } from 'react-toastify';

const PullReq = () => {
    const navigate = useNavigate();
    let [baseBranch, setBaseBranch] = useState('');
    let [compareBranch, setCompareBranch] = useState('');
    let [baseBranchFiles, setBaseBranchFiles] = useState();
    let [compareBranchFiles, setCompareBranchFiles] = useState();
    let [branches, setBranches] = useState();
    let [bLoading, setBLoading] = useState();
    let [bError, setBError] = useState(false);
    let [fLoading, setFLoading] = useState(false);
    let [fError, setFError] = useState(false);
    let [cFiles, setCFiles] = useState([]);
    let [uFiles, setUFiles] = useState([]);
    let [coLoading, setCoLoading] = useState(false);

    const { repoId } = useParams();
    //getting branches
    async function getBranches() {
        try {
            setBLoading(true);
            const data = await axios({
                method: "GET",
                url: `${url}/branches/getBranch/${repoId}`,
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setBLoading(false);
            setBranches(data.data);
            setBError(false);
        }
        catch (e) {
            setBError(true);
            setBLoading(false);
        }
    }

    //get files on select
    async function getFiles(branchName, selectId) {
        setFLoading(true);
        try {
            const data = await axios({
                method: "GET",
                url: `${url}/branches/getfilesforcommit/${repoId}?name=${branchName}`,
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setFLoading(false);
            setFError(false);
            if (selectId === 1) {
                baseBranchFiles = data.data
                setBaseBranchFiles(baseBranchFiles);
            }
            else {
                compareBranchFiles = data.data;
                setCompareBranchFiles(compareBranchFiles);
            }
            filediffviewer();
            uncommonfiles();
        }
        catch (e) {
            console.log(e);
            setFError(true);
            setFLoading(false);
        }
    }
    function uncommonfiles() {
        if (baseBranchFiles && baseBranchFiles.length !== 0 && compareBranchFiles && compareBranchFiles.length !== 0) {
            uFiles.splice(0, uFiles.length);
            for (let i in compareBranchFiles) {
                let flag = false;
                for (let j in baseBranchFiles) {
                    if (baseBranchFiles[j].file_name === compareBranchFiles[i].file_name) {
                        console.log(baseBranchFiles[j].file_name, compareBranchFiles[i].file_name)
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    uFiles.push(compareBranchFiles[i].file_name);
                    setUFiles(uFiles);
                }
            }
        }
    }

    function filediffviewer() {
        console.log(231);
        console.log(baseBranchFiles, compareBranchFiles);
        if (baseBranchFiles && baseBranchFiles.length !== 0 && compareBranchFiles && compareBranchFiles.length !== 0) {
            cFiles.splice(0, cFiles.length);
            console.log(123);
            compareBranchFiles.map((file) => {
                baseBranchFiles.map((file1) => {
                    let temp_arr = [];
                    if (file1.file_name === file.file_name && (file1.file_type !== 'jpg' && file1.file_type !== 'png' && file1.file_type !== 'jpeg')) {
                        console.log(file.file_type, file1.file_type)
                        temp_arr.push(file)
                        temp_arr.push(file1);
                        cFiles.push(temp_arr);
                        setCFiles(cFiles);
                    }
                })
            })
        }
    }
    async function commit() {
        try {
            setCoLoading(true);
            const data = await axios({
                method: 'post',
                url: `${url}/branches/commit`,
                data: baseBranchFiles,
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setCoLoading(false);
            toast.success("File upload successfully", {
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
            setCoLoading(false);
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
   async function merge() {
        if (baseBranchFiles && baseBranchFiles.length !== 0 && compareBranchFiles && compareBranchFiles.length !== 0) {

            for (var i in compareBranchFiles) {
                let flag = true;
                for (var j in baseBranchFiles) {
                    if (compareBranchFiles[i].file_name === baseBranchFiles[j].file_name) {
                        flag = false;
                        break;
                    }
                }
                //if common file found
                if (!flag) {
                    baseBranchFiles[j].file_data = compareBranchFiles[i].file_data;
                }
                else {
                    compareBranchFiles[i].branch = baseBranchFiles[i].branch;
                    baseBranchFiles.push(compareBranchFiles[i]);
                }
            }
            await commit();
        }
        console.log(baseBranchFiles);
    }
    useEffect(() => {
        if (!TokenCheck()) {
            navigate("/");
            return;
        }
        getBranches();
    }, [])
    return (
        <div>
            {/*this is branch select */}
            <div className='d-flex justify-content-between p-1'>
                <div className="d-inline-flex">
                    <div className="ms-2">
                        <label>Base Branch:</label>
                        <select onChange={(e) => getFiles(e.target.value, 1)} disabled={fLoading?true:false}>
                            <option value="" disabled={bLoading || bError ? true : false}>{bError ? "something went wrong" : "Select base branch"}</option>
                            {branches && branches.length !== 0 && branches.map((branch) => <option key={branch._id} value={branch.name}>{branch.name}</option>)}
                        </select>
                    </div>
                    <div className="ms-2">
                        <label>Compare Branch:</label>
                        <select onChange={(e) => getFiles(e.target.value, 2)} disabled={fLoading?true:false}>
                            <option value="" disabled={bLoading || bError ? true : false}>{bError ? "something went wrong" : "Select compare branch"}</option>
                            {branches && branches.length !== 0 && branches.map((branch) => <option key={branch._id} value={branch.name}>{branch.name}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <button className="btn btn-success" onClick={() => merge()} disabled={coLoading?true:false}>{coLoading?"Please wait..":"Commit to base branch"}</button>
                </div>
            </div>
            {/*Difference viewer*/}
            <div className="m-2">
                {fLoading ? <span>Please wait while we fetch your files</span> : (baseBranchFiles && baseBranchFiles.length !== 0 && compareBranchFiles && compareBranchFiles.length !== 0 && cFiles.length !== 0 && <DiffViewer cFiles={cFiles} />)}
            </div>
            {/*Uncommon files viewer*/}
            <div className='m-3'>
                {uFiles.length !== 0 && <FilesDiff uFiles={uFiles} />}
            </div>
            <ToastContainer/>
        </div>
    )
}

function DiffViewer({ cFiles }) {
    console.log("DiffViewer", cFiles);
    return (
        cFiles.map((cFile) => {
            const oldCode = `${cFile[1].file_data}`
            const newCode = `${cFile[0].file_data}`
            return (
                <>
                    <h5 className="text-center">{cFile[1].file_name}</h5>
                    <div style={{ height: "500px", overflow: "auto" }} className="m-2">
                        <ReactDiffViewer
                            oldValue={oldCode}
                            newValue={newCode}
                            compareMethod={DiffMethod.LINES}
                            splitView={true}
                        />
                    </div>
                </>
            )
        })
    )
}

function FilesDiff({ uFiles }) {
    console.log("123", uFiles);
    return (
        <div className="text-center">
            <h5>Uncommon files:</h5>
            {uFiles.map((uFile) => uFile)}
        </div>
    )
}

export default PullReq
