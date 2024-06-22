import React, { useEffect } from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import "./navcss.css";

export default function Navbar({ darkMode, toggleDarkMode }) {
  let navigate=useNavigate()
  let location = useLocation();
  useEffect(() => {
      console.log([location.pathname])
    }, [location]);
    const handleLogout=()=>{
      localStorage.removeItem('token')
      navigate('/login');
    }

  return (
    <div>
      <nav className="  navbar navbar-expand-lg shadow-lg p-3 mb-5 bg-body-tertiary rounded bg-secondary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img
              src="\favicon-32x32.png"
              alt="Logo"
              width="30"
              height="24"
              className="d-inline-block align-text-top"
            />
            CloudyNotes
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === "/About" ? "active" : ""}`}
                  to="/About"
                >
                  About
                </Link>
              </li>
            </ul>
            {!localStorage.getItem('token')?<form class="d-flex" role="search">
      <Link class="btn btn-primary mx-2 my-3" role="button" to="/login">Login</Link>
        <Link class="btn btn-primary mx-2 my-3" role="button" to="/signup">Sign Up</Link>
      </form>:<button onClick={handleLogout} className='btn btn-primary'>Sign out</button>}
            <form className="d-flex my-3" role="search">
              <label className="switch">
                <input
                  className="switch__input"
                  type="checkbox"
                  role="switch"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                />
                <svg
                  className="switch__icon switch__icon--light "
                  viewBox="0 0 12 12"
                  width="12px"
                  height="12px"
                  aria-hidden="true"
                >
                  <g fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round">
                    <circle cx="6" cy="6" r="2" />
                    <g strokeLinecap="round">
                      <polyline points="6 10,6 11.5" transform="rotate(0,6,6)" />
                      <polyline points="6 10,6 11.5" transform="rotate(45,6,6)" />
                      <polyline points="6 10,6 11.5" transform="rotate(90,6,6)" />
                      <polyline points="6 10,6 11.5" transform="rotate(135,6,6)" />
                      <polyline points="6 10,6 11.5" transform="rotate(180,6,6)" />
                      <polyline points="6 10,6 11.5" transform="rotate(225,6,6)" />
                      <polyline points="6 10,6 11.5" transform="rotate(270,6,6)" />
                      <polyline points="6 10,6 11.5" transform="rotate(315,6,6)" />
                    </g>
                  </g>
                </svg>
                <svg
                  className="switch__icon switch__icon--dark"
                  viewBox="0 0 12 12"
                  width="12px"
                  height="12px"
                  aria-hidden="true"
                >
                  <g fill="none" stroke="#fff" strokeWidth="1" strokeLinejoin="round" transform="rotate(-45,6,6)">
                    <path d="m9,10c-2.209,0-4-1.791-4-4s1.791-4,4-4c.304,0,.598.041.883.105-.995-.992-2.367-1.605-3.883-1.605C2.962.5.5,2.962.5,6s2.462,5.5,5.5,5.5c1.516,0,2.888-.613,3.883-1.605-.285.064-.578.105-.883.105Z" />
                  </g>
                </svg>
                <span className="switch__sr">Dark Mode</span>
              </label>
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
}

