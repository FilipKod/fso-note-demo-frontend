import { useState, useEffect, useRef } from "react";
import Note from "./components/Note";
import noteService from "./services/notes";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import loginService from './services/login'
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import NoteForm from "./components/NoteForm";

const App = () => {
  const [appNotes, setAppNotes] = useState(null);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const noteFormRef = useRef()

  useEffect(() => {
    noteService.getAll().then((initialState) => {
      setAppNotes(initialState);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const addNote = async (noteObj) => {
    const savedNote = await noteService.create(noteObj)

    noteFormRef.current.toggleVisibility()
    setAppNotes(appNotes.concat(savedNote));
  };

  const notesToShow = showAll
    ? appNotes
    : appNotes.filter((note) => note.important);

  const toggleImportanceOf = (id) => {
    const note = appNotes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((updatedNote) => {
        setAppNotes(
          appNotes.map((note) => (note.id === id ? updatedNote : note))
        );
      })
      .catch(() => {
        setErrorMessage(
          `the note '${note.content}' was alredy deleted from server`
        );
        setTimeout(() => setErrorMessage(null), 5000);
        setAppNotes(appNotes.filter((n) => n.id !== id));
      });
  };

  const handleLogin = async (event) => {
    event.preventDefault()
   
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedNoteAppUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => {
   

    return (
      <Togglable buttonLabel="login">
        <LoginForm 
          username={username}
          password={password}
          handleUsernameChange={({target}) => setUsername(target.value)}
          handlePasswordChange={({target}) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>

    )
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged</p>
          <Togglable buttonLabel="new note" ref={noteFormRef}>
            <NoteForm createNote={addNote} />
          </Togglable>
        </div>
      )}      

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow &&
          notesToShow.map((note) => (
            <Note
              key={note.id}
              note={note}
              toggleImportance={() => toggleImportanceOf(note.id)}
            />
          ))}
      </ul>
      
      <Footer />
    </div>
  );
};

export default App;
