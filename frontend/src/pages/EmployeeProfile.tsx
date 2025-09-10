import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  Divider,
  Chip,
  Box,
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";

export default function EmployeeProfile() {
  const id  = localStorage.getItem('id'); // get employee ID from route param
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axiosInstance.get("/auth/getUserProfile");
        console.log(res.data, "res.data")
        setEmployee(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployee();
  }, [id]);

  if (!employee) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        Loading profile...
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "primary.main",
                fontSize: 28,
              }}
            >
              {employee.user.full_name?.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h5" fontWeight="bold">
              {employee.user.full_name}
            </Typography>
            <Typography color="text.secondary">{employee.email}</Typography>
            <Typography variant="body2" color="success.main">
              {employee.user.is_active ? "Active" : "Inactive"}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Employee Info */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Role
            </Typography>
            <Typography variant="body1">{employee.user.role || "-"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Department
            </Typography>
            <Typography variant="body1">
              {employee.user.department || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Reporting Manager
            </Typography>
            <Typography variant="body1">
              {employee.user.reporting_manager || "-"}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Skills Section */}
        <Typography variant="h6" gutterBottom>
          Skills & Experience
        </Typography>
        <Box>
          {employee.skills && employee.skills.length > 0 ? (
            employee.skills.map((skill: any, idx: number) => (
              <Chip
                key={idx}
                label={`${skill.technology_name} (${skill.experience_years} yrs)`}
                color="primary"
                variant="outlined"
                sx={{ m: 0.5 }}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No skills added
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
