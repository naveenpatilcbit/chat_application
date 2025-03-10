import { Message, MessageListAPIResponse } from "@models/Message";
import { useState, useEffect, useRef } from "react";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import api from "@utils/ApiUtil";
import { useChat } from "../../context/ChatContext";

export const MessageList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setMessagesList, messagesList } = useChat();

  /*
    In UseEffect use fetchAPI to fetch messages list.
*/

  const handleScroll = () => {
    if (!containerRef.current) return;

    if (containerRef.current.scrollTop === 0 && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const fetchMessages = async (pageNum: number) => {
    try {
      setIsLoading(true);
      const response = await api.get<MessageListAPIResponse>("messages", {
        page: pageNum,
      });
      console.log("page" + pageNum + "response" + response.json);
      if (!response.ok) throw new Error("Failed to fetch messages");
      var data: Message[] = response.json;
      setMessagesList((prev) => [...data, ...prev]);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(page);
  }, [page]); // ✅ Empty dependency array to run once on mount

  return (
    <Box
      ref={containerRef}
      onScroll={handleScroll}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "400px",
        width: "100%",
        overflowY: "scroll",
        overflowX: "scroll",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        backgroundColor: "#f5f5f5",
      }}
    >
      {isLoading && (
        <CircularProgress sx={{ alignSelf: "center", marginBottom: "10px" }} />
      )}

      {messagesList.map((msg) => (
        <Box
          key={msg.id}
          sx={{
            display: "flex",
            justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
            mb: 1,
          }}
        >
          <Paper
            sx={{
              padding: "10px",
              maxWidth: "60%",
              backgroundColor: msg.sender === "user" ? "#2196f3" : "#ffffff",
              color: msg.sender === "user" ? "#fff" : "#000",
              borderRadius: "10px",
              boxShadow: 2,
            }}
          >
            <Typography variant="body1">{msg.id}</Typography>
            <Typography variant="body1">{msg.message}</Typography>
          </Paper>
        </Box>
      ))}
    </Box>
  );
};
