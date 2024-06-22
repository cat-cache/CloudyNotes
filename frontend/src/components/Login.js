import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


const Login = (props) => {
    const [credential,setCredentials]=useState({email:"",password:""});
    let navigate=useNavigate()
    
    
    const handleChange=(event)=>{
        setCredentials({...credential,[event.target.name]:event.target.value})
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
  <div class="mb-3">
    <label for="email" class="form-label">Email address</label>
    <input type="email" class="form-control" id="email" value={credential.email} name="email" onChange={handleChange} aria-describedby="emailHelp"/>
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input type="password" class="form-control" id="password" value={credential.password} onChange={handleChange} name="password"/>
  </div>
  <button type="submit" class="btn btn-primary">Login</button>
</form>
    </div>
  )
}

export default Login
