const express = require("express");
const router = express.Router();
const User = require('../models/User')
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET="vyvyvy";
const fetchuser = require('../middleware/fetchuser')

//ROUTE 1-Create a user using POST:/api/auth/

router.post('/createuser',
//check to see all fields
   check('email').isEmail(),check('password').isLength({min:5}),check('name').isLength({min:3}),/*async important for await instruction */async(req,res)=>{
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({errors:errors.array()});
    }
    //try and catch method
    try{
      //check if email already present in the db
  let user = await User.findOne({email: req.body.email});
  if(user){
   return res.status(400).json({error:"Sorry user with this email already exists"})
  }

  const salt = await bcrypt.genSaltSync(10);
  const secPass = await bcrypt.hash(req.body.password,salt);

    user =  await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass
    })
    const data={
      id:user.id
    }
    const authToken = jwt.sign(data,JWT_SECRET);
    

    res.json({authToken})
    
    } catch(err) {console.log(err.message)
      //send 500 erros
    res.status(500).send("Some error has occured")}
   } 
   )

   //ROUTE:1 - authenticate a user


   router.post('/login',
   //check to see all fields
      check('email').isEmail(),check('password').isLength({min:5}),check('password').exists(),/*async important for await instruction */async(req,res)=>{
        const errors = validationResult(req);
       if (!errors.isEmpty()) {
      return res.status(400).json({errors:errors.array()});
        }
        const{email,password}=req.body;
        try{
          let user =await User.findOne({email});
          if(!user){
            return res.status(400).json({error:"Incorrect email or password"})
          }
          const passwordCompare= await bcrypt.compare(password,user.password);
          if(!passwordCompare){
            return res.status(400).json({error:"Incorrect email or password"})
          }

          const data={
            user:{
            id:user.id
            }
          }
          const authToken = jwt.sign(data,JWT_SECRET);
          
          res.json(authToken)

          }
          catch(err) {console.log(err.message)
           
            //send 500 erros
          res.status(500).send("Internal Server Error")}
       
      })

      //ROUTE 3- GET LOGGED IN USER DETAILS

      router.post('/getuser',fetchuser,async(req,res)=>{
      try {
        const userId=req.user.id;
        const user  = await User.findById(userId).select("-password");
        res.send(user)
      } catch (error) {
        console.log(error.message)
            //send 500 erros
          res.status(500).send("Internal Server Error")
      }
    })


module.exports = router
