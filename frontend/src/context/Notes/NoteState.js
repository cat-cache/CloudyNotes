import React, { useState } from "react";
import noteContext from "./NoteContext";

const NoteState=(props)=>{
    const host="http://localhost:5000"
    const initialNotes=[]
        const[notes,setNotes] =useState(initialNotes)

        const getNotes=async()=>{

            //API CALL
            const response = await fetch(`${host}/api/notes/fetchallnotes`, {
                method: 'GET', 
                headers: {
                    "Content-Type": "application/json",
                    "auth-token" : localStorage.getItem('token')
                  }
                 
                });
                //Set Notes
                const json = await response.json();
                console.log(json.notes)
                setNotes(json.notes)
                
        }

        //Add a Note
        const addNote=async(title,description,tag)=>{

            //API CALL
            const response = await fetch("http://localhost:5000/api/notes/addnotes", {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                    "auth-token" : localStorage.getItem('token')
                  },
                body: JSON.stringify({title,description,tag})
                })
                 const note=await response.json();
                 console.log(note);
            setNotes(notes.concat(note.notes))
        }
        //Delete a Note
        const deleteNote=async(id)=>{
            //API CALL

            const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
                method: "DELETE", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                    "auth-token" : localStorage.getItem('token')
                  },
                  
                })
                 const json=await response.json();
                 console.log(json)

            //Deleting Note
            const newNotes=notes.filter((note)=>{return note._id!==id})
            setNotes(newNotes);
        }
        // Edit a Note
        const editNote=async(id,title,description,tag)=>{
            //API CALL

            const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
                method: "PUT", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                    "auth-token" : localStorage.getItem('token')
                  },
                  body: JSON.stringify({title,description,tag})
                  
                })
                 const json=await response.json();
                 console.log(json)


                 let newNotes = JSON.parse(JSON.stringify(notes))
            for (let index = 0; index < newNotes.length; index++) {
                const element = newNotes[index];
                if(element._id===id){
                    newNotes[index].title=title;
                    newNotes[index].description=description
                    newNotes[index].tag=tag
                    break;
                }
                
                
            }
            console.log(newNotes)
            setNotes(newNotes)
        }
    return(
        
        <noteContext.Provider value={{notes,setNotes,addNote,deleteNote,editNote,getNotes}}>
            {props.children}
        </noteContext.Provider>
    )
}

export default NoteState;