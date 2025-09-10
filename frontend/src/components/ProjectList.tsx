import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface Project {
  id: string;
  name: string;
  // add other fields returned by your API
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<"employee" | "technology">(
    "employee"
  );
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [employees, setEmployees] = useState<any[]>([]);
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | number>("");
  const [role, setRole] = useState("");
  const id = localStorage.getItem("id").toString();
  const userRole = localStorage.getItem("role");

  const fetchEmployees = async () => {
    const res = await axiosInstance.get("/auth/getUsers");
    setEmployees(res.data);
  };

  const fetchTechnologies = async () => {
    const res = await axiosInstance.get("/employee/getTechnologies");
    setTechnologies(res.data);
  };
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        let response;
        if (userRole === "Admin") {
          response = await axiosInstance.get(`/project/projects`);
           setProjects(response.data);
        } else if (userRole === "Technical Manager") {
          response = await axiosInstance.get(`/project/projects/for-manager/${id}`);
           setProjects(response.data.projects);
        } else if (userRole === "software Developer") {
          response = await axiosInstance.get(`/project/employee/${id}`);
           setProjects(response.data.projects);
        }

       
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [id]);
  useEffect(() => {
    fetchEmployees();
    fetchTechnologies();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  const handleAdd = async () => {
    if (!selectedProjectId) return;

    if (dialogType === "employee") {
      const payload = {
        projectId: selectedProjectId,
        employeeId: selectedId,
        roleInProject: role || "Member", // role from textfield
      };

      const response = await axiosInstance.post(
        `/project/AddEmployeeToProject`,
        payload
      );
      console.log(response, "response emp");
    } else {
      const payload = {
        projectId: selectedProjectId,
        technologyIds: Array.isArray(selectedId) ? selectedId : [selectedId],
      };
      const response = await axiosInstance.post(
        `/project/AddTechnologiesToProject`,
        payload
      );
      console.log(response, "response texch");
    }

    // setInputValue("");
    setOpenDialog(false);
  };
  const handleOpenDialog = (
    type: "employee" | "technology",
    projectId: number
  ) => {
    setDialogType(type);
    setSelectedProjectId(projectId);
    setOpenDialog(true);
  };
  return (
    <Grid container spacing={3} p={3}>
      {projects.map((project: any) => (
        <Grid item xs={12} md={6} key={project.project_id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {project.project_name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {project.description}
              </Typography>
              <Typography variant="caption" display="block">
                {`Start: ${new Date(
                  project.start_date
                ).toLocaleDateString()} - End: ${new Date(
                  project.end_date
                ).toLocaleDateString()}`}
              </Typography>

              {/* Employees */}
              <Typography variant="subtitle2" mt={2}>
                Employees:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {project.employees
                  .filter((emp) => emp.name)
                  .map((emp) => (
                    <Chip
                      key={emp.id}
                      label={`${emp.name} (${emp.role_in_project})`}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
              </Stack>
              {(userRole === "Admin" || userRole === "Technical Manager") && (
                <Button
                  size="small"
                  onClick={() =>
                    handleOpenDialog("employee", project.project_id)
                  }
                >
                  Add Employee
                </Button>
              )}

              {/* Technologies */}
              <Typography variant="subtitle2" mt={2}>
                Technologies:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {project.technologies
                  .filter((tech) => tech.name)
                  .map((tech) => (
                    <Chip
                      key={tech.id}
                      label={tech.name}
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
              </Stack>
              {(userRole === "Admin" || userRole === "Technical Manager") && (
                <Button
                  size="small"
                  onClick={() =>
                    handleOpenDialog("technology", project.project_id)
                  }
                >
                  Add Technology
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}

      {/* Dialog */}
      <Dialog
        PaperProps={{
          sx: {
            width: 800,
            maxWidth: "90vw",
            p: 2,
            borderRadius: 2,
          },
        }}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>
          {dialogType === "employee" ? "Add Employee" : "Add Technology"}
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="dense"
            label={
              dialogType === "employee"
                ? "Select Employee"
                : "Select Technology"
            }
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {dialogType === "employee"
              ? employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.full_name}
                  </MenuItem>
                ))
              : technologies.map((tech) => (
                  <MenuItem key={tech.id} value={tech.id}>
                    {tech.name}
                  </MenuItem>
                ))}
          </TextField>
          {dialogType === "employee" && (
            <TextField
              fullWidth
              margin="dense"
              label="Role in Project"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
export default Projects;
