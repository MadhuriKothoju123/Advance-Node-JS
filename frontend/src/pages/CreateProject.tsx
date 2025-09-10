import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreateProjectForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });
 const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        console.log(formData, "formData");
        
      const response = await axiosInstance.post("/project/createProject", formData);
      console.log("Project created:", response);
      alert("Project created successfully!");
      navigate('/projects');
    } catch (err) {
      console.error("Failed to create project:", err);
      alert("Error creating project");
    }
  };

   return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Create New Project
      </Typography>

      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Project Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        />

        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />

        <TextField
          label="End Date"
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <Button type="submit" variant="contained" color="primary">
          Create Project
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateProjectForm;
