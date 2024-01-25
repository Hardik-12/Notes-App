/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
// import {nanoid} from "nanoid"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore"
import { db, notesCollection } from "./firebase"
import './App.css'

export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    const [tempNoteText, setTempNoteText] = React.useState('')
    
    const currentNote = notes.find(note => note.id === currentNoteId
    ) || notes[0]


    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)
    
    async function createNewNote() {
        const newNote = {
            body: "# TEST",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }

    React.useEffect(() => {
        if(!currentNoteId){
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])


    React.useEffect(() => {
        if(currentNote){
            setTempNoteText(currentNote.body)
        }
    }, [currentNote])

    React.useEffect(() => {
        const timeOutId = setTimeout(() => {
            if(tempNoteText !== currentNote.body){
                updateNote(tempNoteText)
            }
        }, 500);

        return () => clearTimeout(timeOutId)
    }, [tempNoteText])
    


    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function(snapshot){
            console.log("Docs", snapshot.docs)
            // Sync up our local notes array with the snapshot data
            // Snapshot provides us the latest status of the database and accordingly we can update our local state
            const notesArray = snapshot.docs.map((doc) => {
                return {
                    ...doc.data(),
                    id: doc.id
                }
            })
            console.log("NewIdAllocated", notesArray.length > 0 && notesArray[0].id)
            setNotes(notesArray)
        })

        // unsubscribe from the listener
        return unsubscribe
    }, [])


   
    
    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, {body: text, updatedAt: Date.now()}, {merge: true})
        
    }


    async function deleteNote(noteId){
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
    }
    
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={sortedNotes}  
                    currentNote={currentNote}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                    
                <Editor 
                    tempNoteText={tempNoteText} 
                    setTempNoteText={setTempNoteText} 
                />
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
