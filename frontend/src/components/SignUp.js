import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const SignUp = (props) => {
  const [credential,setCredentials]=useState({name:"",cpassword:"",email:"",password:""});
  let navigate=useNavigate()
  
    
    
    const handleChange=(event)=>{
        setCredentials({...credential,[event.target.name]:event.target.value})
    }

    const handleSubmit=async(e)=>{
      e.preventDefault();
      const response = await fetch("http://localhost:5000/api/auth/createuser", {
              method: "POST", 
              headers: {
                  "Content-Type": "application/json",
                },
              body: JSON.stringify({email:credential.email,password:credential.password,name:credential.name})
              })
              const json=await response.json();
              console.log(json)
              if(json.error===undefined){
                props.showAlert("Succesfully Registered","success")
                navigate('/login')
              }
              else{
                props.showAlert(json.error,"warning")
              }
              
              
  }

  return (
   <><form onSubmit={handleSubmit} className="container shadow-lg p-3 mb-5 bg-body-tertiary rounded bg-secondary">
    <h2>Sign Up</h2>
    
      <div class="my-3">
        
    <label for="name" class="form-label">Name</label>
    <input type="text" class="form-control" id="name" name="name" onChange={handleChange} aria-describedby="name" />
  </div>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control" id="email" name="email" onChange={handleChange} aria-describedby="emailHelp" />
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" id="password" name="password" onChange={handleChange} required minLength={5}/>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Confirm Password</label>
    <input type="password" class="form-control" id="cpassword" name="cpassword" onChange={handleChange} required minLength={5} />
  </div>
  
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
</>
  )
}

export default SignUp
