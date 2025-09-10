// Login.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

type LoginFormInputs = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const role= localStorage.getItem('role');

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);

      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("id", res.data.user.id);
      localStorage.setItem("full_name", res.data.user.full_name);
      localStorage.setItem("role", res.data.user.role_name);
      reset();
      if(role!== 'HR Executive'){ navigate("/projects");
      }
      else {
        navigate("/register");}
    } catch (error) {
      console.error("Registration error", error);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: 360, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email Field */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* Password Field */}
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, borderRadius: 2, py: 1 }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
