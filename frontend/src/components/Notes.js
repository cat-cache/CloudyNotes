import React, { useContext, useEffect, useRef,useState } from 'react'
import noteContext from '../context/Notes/NoteContext'
import NoteItem from './NoteItem'
import AddNote from './AddNote'
import { useNavigate } from 'react-router-dom'

const Notes = (props) => {
    const context =useContext(noteContext)
    const{notes,getNotes}=context;
    let navigate=useNavigate()
     useEffect( ()=>{
      if(localStorage.getItem('token')){
        console.log(localStorage.getItem('token'))
        getNotes();
      }
      else{
        props.showAlert("Please login First","warning")
        navigate('/login')
      }
        // eslint-disable-next-line
    },[])


    const updateNote=(currentNote)=>{
      ref.current.click();
      setNote({id:currentNote._id,etitle:currentNote.title,edescription:currentNote.description,etag:currentNote.tag});
      
    }
    const ref=useRef(null)
    const refClose=useRef(null)
    const [note,setNote]=useState({id:"",etitle:"",edescription:"",etag:""})

    const handleChange=(event)=>{
      setNote({...note,[event.target.name]:event.target.value})
  }
  const handleClick=(e)=>{
      e.preventDefault();
      context.editNote(note.id,note.etitle,note.edescription,note.etag)
      props.showAlert("Note Updated","success")
      refClose.current.click();
  }

  return (
    <>
   < AddNote showAlert={props.showAlert}/>
   {/* <!-- Button trigger modal --> */}
<button type="button" ref={ref} class="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Launch demo modal
</button>

{/* <!-- Modal --> */}
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"  aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <div className="container my-3">
        <div class="mb-3">
  <label for="title" class="form-label">Title</label>
  <input type="text" class="form-control" id="title" name="etitle" value={note.etitle} onChange={handleChange} minLength={3} required/>
</div>
<div class="mb-3">
  <label for="tag" class="form-label">Tag</label>
  <input type="text" class="form-control" id="tag" name="etag" value={note.etag} onChange={handleChange} required/>
</div>
<div class="mb-3">
  <label for="description" class="form-label">Example textarea</label>
  <textarea class="form-control" id="description" name="edescription" value={note.edescription} onChange={handleChange}  rows="3" minLength={3} required></textarea>
</div>
</div>
      </div>
      <div class="modal-footer">
        <button type="button" ref={refClose} class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button disabled={note.etitle.length<3 || note.edescription.length<3} type="button" class="btn btn-primary" onClick={handleClick}>Save changes</button>
      </div>
    </div>
  </div>
</div>
    <div className="row mb-4">
    <h2>YOUR NOTES</h2>
    <div className='container'>
    {notes.length===0 && "No Notes to display"}
    </div>
    {notes.map((note)=>{
        return <NoteItem key={note._id} showAlert={props.showAlert} updateNote={updateNote} note={note}/>
    })}
</div>
</>
  )
}

export default Notes

