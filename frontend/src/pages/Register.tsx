import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  roleId: string;
  departmentId: string;
  reporitngToId: string;
}

export default function Register() {
  const { control, handleSubmit, reset } = useForm<FormData>();
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [employees, setEmployees] = useState<{ id: string; full_name: string, email: string }[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [message, setMessage] = useState("");
const navigate = useNavigate();
  // Initial data fetch: departments & managers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, empRes] = await Promise.all([
          axiosInstance.get("/auth/getDepartments"),
          axiosInstance.get("/auth/getMangersAndLeads"),
        ]);
        setDepartments(deptRes.data);
        setEmployees(empRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  // Fetch roles based on department selection
  useEffect(() => {
    if (selectedDepartment) {
      const fetchRoles = async () => {
        try {
          const response = await axiosInstance.get(`/auth/roles/${selectedDepartment}`);
          setRoles(response.data);
        } catch (error) {
          console.error("Error fetching roles", error);
          setRoles([]);
        }
      };
      fetchRoles();
    } else {
      setRoles([]);
    }
  }, [selectedDepartment]);

  const onSubmit = async (data: FormData) => {
    try {
      await axiosInstance.post("/auth/register", data);
      setMessage("Employee registered successfully.");
      reset();
      setSelectedDepartment("");
      setRoles([]);
      navigate('/employees');
    } catch (error) {
      console.error("Registration error", error);
      setMessage("Registration failed. Try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h5" gutterBottom>
          HR Employee Registration
        </Typography>

        {message && <Typography color="success.main">{message}</Typography>}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <Controller
            name="fullName"
            control={control}
            defaultValue=""
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <TextField {...field} label="Full Name" fullWidth margin="normal" />
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{ required: "Email is required" }}
            render={({ field }) => (
              <TextField {...field} label="Email" type="email" fullWidth margin="normal" />
            )}
          />

          {/* Password */}
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <TextField {...field} label="Password" type="password" fullWidth margin="normal" />
            )}
          />

          {/* Department */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Department</InputLabel>
            <Controller
              name="departmentId"
              control={control}
              defaultValue=""
              rules={{ required: "Department is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Department"
                  onChange={(e) => {
                    field.onChange(e); // update form
                    setSelectedDepartment(e.target.value); // trigger roles fetch
                  }}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          {/* Role (depends on selected department) */}
          <FormControl fullWidth margin="normal" disabled={!roles.length}>
            <InputLabel>Role</InputLabel>
            <Controller
              name="roleId"
              control={control}
              defaultValue=""
              rules={{ required: "Role is required" }}
              render={({ field }) => (
                <Select {...field} label="Role">
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          {/* Reporting Manager */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Reporting Manager</InputLabel>
            <Controller
              name="reporitngToId"
              control={control}
              defaultValue=""
              rules={{ required: "Reporting manager is required" }}
              render={({ field }) => (
                <Select {...field} label="Reporting Manager">
                  {employees.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.full_name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          {/* Submit */}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register Employee
          </Button>
        </form>
      </Box>
    </Container>
  );
}
