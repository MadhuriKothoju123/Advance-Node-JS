import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [technologyId, setTechnologyId] = useState("");
  const [experienceYears, setExperienceYears] = useState("");

  const navigate = useNavigate();
const role= localStorage.getItem('role');
const id= localStorage.getItem('id')

    useEffect(() => {
    const fetchData = async () => {
      try {
        if (role==='Technical Manager') {
          // ✅ If managerId exists → get employees reporting to manager
          const [empRes, techRes] = await Promise.all([
            axiosInstance.get(`/auth/reporting/${id}`),
            axiosInstance.get("/employee/getTechnologies"),
          ]);
          setEmployees(empRes.data);
          setTechnologies(techRes.data);
        } else if(role==='Admin') {
          const [empRes, techRes] = await Promise.all([
            axiosInstance.get("/auth/getUsers"),
            axiosInstance.get("/employee/getTechnologies"),
          ]);
          setEmployees(empRes.data);
          setTechnologies(techRes.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleOpenDialog = (user: any) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };
  const handleAddSkill = async () => {
    try {
      await axiosInstance.post("employee/assignSkill", {
        userId: selectedUser,
        technologyId,
        experienceYears: parseFloat(experienceYears),
      });

      setOpenDialog(false);
      setTechnologyId("");
      setExperienceYears("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/register")}
      >
        Register Employee
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Role</b>
              </TableCell>
              <TableCell>
                <b>Department</b>
              </TableCell>
              <TableCell>
                <b>Manager</b>
              </TableCell>
              <TableCell>
                <b>Technologies & Experience</b>
              </TableCell>
              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>{emp.full_name}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.role_name}</TableCell>
                <TableCell>{emp.department_name}</TableCell>
                <TableCell>{emp.reporting_manager_name}</TableCell>
                <TableCell>
                  {emp.skills && emp.skills.length > 0 ? (
                    emp.skills.map((skill: any, idx: number) => (
                      <Chip
                        key={idx}
                        label={`${skill.technology} (${skill.experience_years} yrs)`}
                        size="small"
                        sx={{ margin: "2px" }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No skills added
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleOpenDialog(emp.id)}
                  >
                    Add Skill
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Adding Skill */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Assign Skill to {selectedUser?.full_name}</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="dense"
            label="Select Technology"
            value={technologyId}
            onChange={(e) => setTechnologyId(e.target.value)}
          >
            {technologies.map((tech) => (
              <MenuItem key={tech.id} value={tech.id}>
                {tech.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            margin="dense"
            label="Experience (years)"
            type="number"
            inputProps={{ step: "0.1", min: "0" }}
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSkill} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
