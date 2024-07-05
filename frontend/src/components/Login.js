import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


const Login = (props) => {
    const [credential,setCredentials]=useState({email:"",password:""});
    let navigate=useNavigate()
    
    const handleChange=(event)=>{
        setCredentials({...credential,[event.target.name]:event.target.value})
    }

    const generateEncryptionKey = async (password, salt) => {
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
        );

        return window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: new TextEncoder().encode(salt),
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify({email:credential.email,password:credential.password})
                })
                const json=await response.json();
                console.log(json)
                if(json.error===undefined){
                    // Save auth-token and redirect
                    localStorage.setItem('token',json);

                    // Generate and store encryption key
                    const encryptionKey = await generateEncryptionKey(credential.password, credential.email);
                    const exportedKey = await window.crypto.subtle.exportKey("raw", encryptionKey);
                    const keyBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedKey)));
                    sessionStorage.setItem('encryptionKey', keyBase64);

                    props.showAlert("Successfully Logged in","success")
                    navigate('/')
                }
                else{
                  props.showAlert(json.error,"warning")
                }
    }

    return (
        <div className="shadow-lg p-3 mb-5 bg-body-tertiary rounded bg-secondary">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" value={credential.email} name="email" onChange={handleChange} aria-describedby="emailHelp"/>
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" value={credential.password} onChange={handleChange} name="password"/>
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
    )
}

export default Login
