const express = require("express");
const router2 = express.Router();
const fetchuser = require('../middleware/fetchuser')
const Notes = require('../models/Notes')
const { check, validationResult } = require('express-validator');


//ROUTE 1- GET ALL THE NOTES
router2.get('/fetchallnotes',fetchuser,async(req,res)=>{
    try{
    const notes = await Notes.find({user:req.user.id});
    res.json({notes})
    }catch(err) {console.log(err.message)
        //send 500 erros
      res.status(500).send("Some error has occured")}

})
//ROUTE-2 ADD NOTES
router2.post('/addnotes',fetchuser,check('title').isLength({min:3}),check('description').isLength({min:3}),async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors:errors.array()});
    }
    try{
    const notes =  await Notes.create({
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag,
        user:req.user.id
      })
      res.json({notes});
    }catch(err) {console.log(err.message)
        //send 500 erros
      res.status(500).send("Some error has occured")}
})

//ROUTE-3 UPDATE NOTES
router2.put('/updatenote/:id',fetchuser,async(req,res)=>{
    var{title,description,tag}=req.body;
    try{
    var newNote={};
    if(title){newNote.title=title}
    if(tag){newNote.tag=tag}
    if(description){newNote.description=description}

    //Find note to update
     let note = await Notes.findById(req.params.id);
     if(!note){return res.status(404).send("Note not found")};
     //allow correct user to make changes
     if(note.user.toString() !== req.user.id){
     return res.status(401).send("NOT ALLOWED")
     }
     //set new note
     note =await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
     res.json({note});
    }catch(err) {console.log(err.message)
        //send 500 erros
      res.status(500).send("Some error has occured")}
})

// Route-4 Delete NOTES
router2.delete('/deletenote/:id',fetchuser,async(req,res)=>{
    //Find note to delete
    try{
    let note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Note not found")};
    //allow correct user to delete
    if(note.user.toString() !== req.user.id){
    return res.status(401).send("NOT ALLOWED")
    }
    //find note by id passed in params and delete it
    await Notes.findByIdAndDelete(req.params.id)
    res.json({Success:"Success the Note has been deleted"}) 
    }catch(err) {console.log(err.message)
    //send 500 erros
    res.status(500).send("Some error has occured")}
})
module.exports = router2