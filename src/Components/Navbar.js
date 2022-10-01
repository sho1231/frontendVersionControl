import React from 'react'
import { NavLink } from 'react-router-dom';
import { TokenCheck } from '../TokenCheck';
import Logout from '../Logout';



const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-sm sticky-top navbar-light bg-dark">
            <a className="navbar-brand logo" style={{ color: 'white' }}>VersionControl
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    {!TokenCheck() && <li className="nav-item">
                        <a className="nav-link" aria-current="page">
                            <NavLink end to="/">Login</NavLink>
                        </a>
                    </li>}
                    {!TokenCheck() && <li className="nav-item">
                        <a className="nav-link">
                            <NavLink to="/register">Register</NavLink>
                        </a>
                    </li>}
                    {TokenCheck() && <li className="nav-item">
                        <a className="nav-link">
                            <NavLink to="/yourrepo">Your repositories</NavLink>
                        </a>
                    </li>}
                    {TokenCheck() && <li className="nav-item">
                        <a className="nav-link">
                            <NavLink to="/addrepo">Add Repository</NavLink>
                        </a>
                    </li>}
                    {TokenCheck() && <li className="nav-item">
                        <a className="nav-link">
                            <NavLink to="/search">Find repos</NavLink>
                        </a>
                    </li>}
                    {TokenCheck() && <li className="nav-item">
                        <a className="nav-link" onClick={Logout}>
                            <NavLink to="/" style={{ color: "white", fontWeight: "normal" }}>Logout</NavLink>
                        </a>
                    </li>}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
