import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import api from "@utils/ApiUtil"; // Your API utility for making HTTP requests

interface LoginResponse {
  token: string;
  user?: {
    id: string;
    email: string;
  };
}

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const validateInputs = (): boolean => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setError("Invalid email address");
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post<LoginResponse>("/login", {
        email,
        password,
      });

      const { token, user } = response;

      if (!token) {
        throw new Error("Invalid response from server");
      }

      // Store token for authenticated requests
      localStorage.setItem("authToken", token);

      // Optionally store user data if needed
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      // Redirect to the chat page after successful login
      navigate("/chat");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred during login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            type="email"
            required
            autoComplete="email"
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Login"}
          </Button>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Link component={RouterLink} to="/register" variant="body2">
              Don't have an account? Sign up
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
