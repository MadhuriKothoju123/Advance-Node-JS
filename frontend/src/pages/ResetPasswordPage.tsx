// pages/ResetPasswordPage.tsx
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/auth/reset-password", {
        token,
        password,
      });

      setMessage(res.data.message || "Password reset successful!");
      setError("");
    } catch (err: any) {
      setError( err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Reset Password
        </Typography>

        {token ? (
          <form onSubmit={handleSubmit}>
            <TextField
              type="password"
              label="New Password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Reset Password
            </Button>
          </form>
        ) : (
          <Alert severity="error">Invalid or missing token.</Alert>
        )}

        {message && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
}
