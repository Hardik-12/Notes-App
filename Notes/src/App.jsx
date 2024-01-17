/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import {nanoid} from "nanoid"
import './App.css'

export default function App() {
    const [notes, setNotes] = React.useState( () => {
        return JSON.parse(localStorage.getItem('Notes')) || []
    }
    )
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )

    
    function createNewNote() {
        const newNote = {
            id: nanoid(),  
            body: "# Type your markdown note's title here"
        }

        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }


    React.useEffect(() => {
        localStorage.setItem('Notes', JSON.stringify(notes))
    }, [notes])


    function swap(notes, index){
        const temp = notes[0]
        notes[0] = notes[index]
        notes[index] = temp
    }
    
    function updateNote(text) {
        setNotes(oldNotes => oldNotes.map((oldNote, index) => {
            let newObject = oldNote;
            if(oldNote.id === currentNoteId){
                newObject = {...newObject, body: text}
                swap(notes, index)
            }
            return newObject
        }))
    }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
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
                    notes={notes}  
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
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
