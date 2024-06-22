import React, { useContext, useState } from 'react';
import noteContext from '../context/Notes/NoteContext';

const AddNote = (props) => {
    const context = useContext(noteContext);
    const [note, setNote] = useState({ title: "", description: "", tag: "" });

    const handleChange = (event) => {
        setNote({ ...note, [event.target.name]: event.target.value });
    };

    const handleClick = (e) => {
        e.preventDefault();
        context.addNote(note.title, note.description, note.tag);
        props.showAlert("Note added successfully", "success");
        setNote({ title: "", description: "", tag: "" });
    };

    return (
        <div className="container my-3 shadow-lg p-3 mb-5 bg-body-tertiary rounded">
            <h2>Add your note &#9729;</h2>
            <div className="container my-3">
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" value={note.title} onChange={handleChange} placeholder="Write title here..." minLength={3} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={handleChange} placeholder="Tag the note here..." required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Note:</label>
                    <textarea className="form-control" id="description" name="description" placeholder="Begin typing..." value={note.description} onChange={handleChange} rows="3" minLength={3} required></textarea>
                </div>
                <button type="submit" disabled={note.title.length < 3 || note.description.length < 3} className="btn btn-primary" onClick={handleClick}>Save it</button>
            </div>
        </div>
    );
}

export default AddNote;
