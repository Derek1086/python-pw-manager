import React from "react";
import "../styles/Note.css";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Card from "@mui/material/Card";
import EditIcon from "@mui/icons-material/Edit";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";

function censorText(text) {
  return "*".repeat(text.length);
}

function Note({ note, onDelete, onEdit }) {
  const copyContentToClipboard = (content) => {
    navigator.clipboard
      .writeText(content)
      .then(() => console.log("Content copied to clipboard"))
      .catch((error) => console.error("Could not copy text: ", error));
  };

  return (
    <Card className="note-container">
      <List sx={{ width: "100%", padding: "20px" }}>
        <Paper
          elevation={3}
          style={{
            paddingLeft: "5px",
            paddingRight: "5px",
            marginBottom: "5px",
          }}
        >
          <ListItem
            key={1}
            disableGutters
            secondaryAction={
              <IconButton
                aria-label="copy"
                onClick={() => copyContentToClipboard(note.title)}
              >
                <ContentCopyIcon />
              </IconButton>
            }
          >
            <ListItemText primary={note.title} />
          </ListItem>
        </Paper>
        <Paper
          elevation={3}
          style={{
            paddingLeft: "5px",
            paddingRight: "5px",
            marginBottom: "5px",
          }}
        >
          <ListItem
            key={2}
            disableGutters
            secondaryAction={
              <IconButton
                aria-label="copy"
                onClick={() => copyContentToClipboard(note.content)}
              >
                <ContentCopyIcon />
              </IconButton>
            }
          >
            <ListItemText primary={censorText(note.content)} />
          </ListItem>
        </Paper>
        <ListItem key={3} disableGutters>
          <div className="row">
            <IconButton onClick={() => onEdit(note)}>
              <EditIcon />
            </IconButton>
          </div>
          <div className="row">
            <IconButton onClick={() => onDelete(note.id)}>
              <DeleteIcon />
            </IconButton>
          </div>
        </ListItem>
      </List>
    </Card>
  );
}

export default Note;
