import React, { useEffect, useState } from 'react';
import { TokenCheck } from '../TokenCheck';
import { useNavigate } from 'react-router-dom';
import url from '../url';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { ContactSupportOutlined } from '@mui/icons-material';

const Search = () => {
    const navigate = useNavigate();
    let [repos, setRepos] = useState([]);
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState(false);
    async function getRepos(q = '') {
        console.log(123,q.length);
        try {
            setLoading(true);
                const data = await axios.request({
                    method: "GET",
                    url: `${url}/repo/search?q=${q}`,
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                repos = data.data;
                setRepos(repos);
            
            setLoading(false);
        }
        catch (e) {
            setError(e);
            setLoading(false);
        }
    }
    useEffect(() => {
        if (!TokenCheck()) {
            navigate('/');
            return;
        }
    }, [])
    return (
        <div className="container-fluid m-2">
            {console.log("Rendered",repos)}
            <div>
                <input className="form-control" type="text" onChange={(e) => {
                    console.log(e.target.value.length===0);
                    if(e.target.value.length===0){
                        console.log("Empty")
                        setRepos([]);
                    }
                    else
                      getRepos(e.target.value);
                }} placeholder="Enter repo name..." />
            </div>
            {loading && <LoadingIcon />}
            <DisplayRepos repos={repos} />
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

function DisplayRepos({ repos }) {
    const navigate = useNavigate();
    console.log("Display", repos);
    return (
        <div className="container-fluid m-2 d-flex flex-column justify-content-between">
            {repos.map((repo) => <div className="m-2" onClick={()=>navigate(`/repo/${repo._id}`)} style={{ cursor: "pointer" }} key={repo._id}>{repo.name}</div>)}
        </div>
    )
}



export default Search
