import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Note from "../components/Note";
import CustomFilledInput from "../components/CustomFilledInput";
import "../styles/Home.css";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [snackbarConfig, setSnackbarConfig] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [noteID, setNoteID] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getNotes();
  }, []);

  const handleEditNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setOpen(true);
    setEditing(true);
    setNoteID(note.id);
  };

  const clearModal = () => {
    setTitle("");
    setContent("");
    setOpen(false);
    setEditing(false);
    setNoteID(null);
  };

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          console.log("Note deleted!");
          setSnackbarConfig({
            open: true,
            message: "Note deleted successfully!",
            severity: "success",
          });
        } else {
          console.log("Failed to delete note.");
        }
        getNotes();
      })
      .catch((error) => alert(error));
  };

  const editNote = (id, updatedData) => {
    const { title, content } = updatedData;

    if (!title.trim() || !content.trim()) {
      setSnackbarConfig({
        open: true,
        message: "Title or content cannot be empty.",
        severity: "error",
      });
      return;
    }
    api
      .put(`/api/notes/${id}/`, updatedData)
      .then((res) => {
        if (res.status === 200) {
          console.log("Note updated!");
          setSnackbarConfig({
            open: true,
            message: "Note updated successfully!",
            severity: "success",
          });
          clearModal();
        } else {
          console.log("Failed to update note.");
          setSnackbarConfig({
            open: true,
            message: "Error updating note!",
            severity: "error",
          });
        }
        getNotes();
      })
      .catch((error) => console.log(error));
  };

  const createNote = (e) => {
    e.preventDefault();
    if (!editing) {
      api
        .post("/api/notes/", { content, title })
        .then((res) => {
          if (res.status === 201) {
            setSnackbarConfig({
              open: true,
              message: "Note created successfully!",
              severity: "success",
            });
            clearModal();
          } else {
            console.log("Failed to make note.");
            setSnackbarConfig({
              open: true,
              message: "Invalid note data",
              severity: "error",
            });
          }
          getNotes();
        })
        .catch((err) => {
          console.log(err);
          setSnackbarConfig({
            open: true,
            message: "Invalid note data",
            severity: "error",
          });
        });
    } else {
      const updatedData = {
        title: title,
        content: content,
      };
      editNote(noteID, updatedData);
    }
  };

  return (
    <div>
      <Header navigate={navigate} />
      <div className="search-bar">
        <SearchBar />
      </div>
      <div className="notes-container">
        {notes.map((note) => (
          <Note
            note={note}
            onDelete={deleteNote}
            onEdit={handleEditNote}
            key={note.id}
          />
        ))}
      </div>
      <Modal open={open} onClose={clearModal}>
        <Card className="form-container">
          <form onSubmit={createNote}>
            <Stack spacing={2}>
              <CustomFilledInput
                type="username"
                id="filled-adornment-user"
                value={title}
                error={
                  snackbarConfig.severity === "error" &&
                  snackbarConfig.open === true
                }
                content="Username"
                onChange={setTitle}
              />
              <CustomFilledInput
                type="password"
                id="filled-adornment-password"
                value={content}
                error={
                  snackbarConfig.severity === "error" &&
                  snackbarConfig.open === true
                }
                content="Password"
                onChange={setContent}
              />

              <Button
                onClick={createNote}
                style={{ width: "100%" }}
                color="secondary"
                variant="contained"
                type="submit"
              >
                Submit
              </Button>
            </Stack>
          </form>
        </Card>
      </Modal>
      <IconButton
        onClick={() => setOpen(true)}
        color="secondary"
        sx={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          height: "75px",
          width: "75px",
          zIndex: "1000",
        }}
      >
        <AddIcon
          sx={{
            height: "40px",
            width: "40px",
          }}
        />
      </IconButton>
      <Snackbar
        open={snackbarConfig.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbarConfig((prevConfig) => ({
            ...prevConfig,
            open: false,
          }))
        }
      >
        <Alert
          onClose={() =>
            setSnackbarConfig((prevConfig) => ({
              ...prevConfig,
              open: false,
            }))
          }
          severity={snackbarConfig.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarConfig.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Home;
