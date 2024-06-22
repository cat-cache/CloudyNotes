import React, { useContext, useState } from 'react'
import noteContext from '../context/Notes/NoteContext';


const NoteItem = (props) => {

    const context =useContext(noteContext)
    const {note, updateNote} =props;

    const [isHoveringT, setIsHoveringT] = useState(false);
  const [isHoveringS, setIsHoveringS] = useState(false);
  return (
    <div className="col-md-3">
    <div class="card my-4" >
  <div class="card-body">
    <h5 class="card-title">{note.title}</h5>
    <h6 class="card-subtitle mb-2 text-body-secondary">{note.tag}</h6>
    <p class="card-text">{note.description}</p>
    <span
            className="trash-icon"
            onMouseEnter={() => setIsHoveringT(true)}
            onMouseLeave={() => setIsHoveringT(false)}
          >
    <i className={`fa-regular fa-trash-can mx-2 ${isHoveringT ? 'fa-shake' : ''}`} onClick={()=>{
        context.deleteNote(note._id);
        props.showAlert("Note Deleted Successfully","success")
    }} ></i></span>
    <span
            className="pen-icon"
            onMouseEnter={() => setIsHoveringS(true)}
            onMouseLeave={() => setIsHoveringS(false)}
          >
    <i className={` fa-solid fa-pen-fancy mx-2 ${isHoveringS ? 'fa-shake' : ''}`} onClick={()=>{
      updateNote(note);
      
    }}></i></span>
    
  </div>
</div>
</div>
  )
}

export default NoteItem
