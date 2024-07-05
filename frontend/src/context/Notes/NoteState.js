import React, { useState } from "react";
import noteContext from "./NoteContext";

const NoteState=(props)=>{
    const host="http://localhost:5000"
    const initialNotes=[]
    const[notes,setNotes] =useState(initialNotes)

    const getEncryptionKey = async () => {
        const keyBase64 = sessionStorage.getItem('encryptionKey');
        if (!keyBase64) throw new Error("Encryption key not found");
        const keyBuffer = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0));
        return window.crypto.subtle.importKey(
            "raw",
            keyBuffer,
            { name: "AES-GCM" },
            false,
            ["encrypt", "decrypt"]
        );
    }

    const encryptNote = async (plaintext) => {
        const key = await getEncryptionKey();
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encoded = new TextEncoder().encode(plaintext);
        
        const ciphertext = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            encoded
        );

        const encryptedData = new Uint8Array(iv.length + ciphertext.byteLength);
        encryptedData.set(iv);
        encryptedData.set(new Uint8Array(ciphertext), iv.length);

        return btoa(String.fromCharCode.apply(null, encryptedData));
    }

    const decryptNote = async (encryptedData) => {
        const key = await getEncryptionKey();
        const data = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
        const iv = data.slice(0, 12);
        const ciphertext = data.slice(12);

        const decrypted = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            key,
            ciphertext
        );

        return new TextDecoder().decode(decrypted);
    }

    const getNotes=async()=>{
        //API CALL
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET', 
            headers: {
                "Content-Type": "application/json",
                "auth-token" : localStorage.getItem('token')
              }
            });
        const json = await response.json();
        const decryptedNotes = await Promise.all(json.notes.map(async (note) => ({
            ...note,
            title: await decryptNote(note.title),
            description: await decryptNote(note.description)
        })));
        setNotes(decryptedNotes);
    }

    const addNote=async(title,description,tag)=>{
        const encryptedTitle = await encryptNote(title);
        const encryptedDescription = await encryptNote(description);

        //API CALL
        const response = await fetch("http://localhost:5000/api/notes/addnotes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token" : localStorage.getItem('token')
              },
            body: JSON.stringify({title: encryptedTitle, description: encryptedDescription, tag})
        })
        const note = await response.json();
        setNotes(notes.concat({...note.notes, title, description}))
    }

    const deleteNote=async(id)=>{
        //API CALL
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token" : localStorage.getItem('token')
              },
        })
        const json = await response.json();
        console.log(json)

        //Deleting Note
        const newNotes = notes.filter((note)=>{return note._id!==id})
        setNotes(newNotes);
    }

    const editNote=async(id,title,description,tag)=>{
        const encryptedTitle = await encryptNote(title);
        const encryptedDescription = await encryptNote(description);

        //API CALL
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token" : localStorage.getItem('token')
              },
              body: JSON.stringify({title: encryptedTitle, description: encryptedDescription, tag})
        })
        const json = await response.json();
        console.log(json)

        let newNotes = JSON.parse(JSON.stringify(notes))
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if(element._id === id){
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
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
