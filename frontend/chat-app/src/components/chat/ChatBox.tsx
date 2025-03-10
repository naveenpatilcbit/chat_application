// src/components/chat/ChatBox.tsx
import { Box, Paper, Typography, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { MessageList } from "./MessageList";
import { useChat } from "../../context/ChatContext";

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const { addMessage } = useChat();
  const handleSendMessage = () => {
    if (!message.trim()) return;
    addMessage(message);
    setMessage("");
  };

  return (
    <Paper
      sx={{
        width: "inherit",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h6">Chat</Typography>

      <MessageList />

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && message.trim() !== "") {
              handleSendMessage();
            }
          }}
        />
        <IconButton color="primary" onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatBox;
