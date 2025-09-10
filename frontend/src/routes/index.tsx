import { Routes, Route } from "react-router-dom";

import ProtectedLayout from "../layouts/ProtectedLayout";
import Register from "../pages/Register";
import Login from "../pages/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import Projects from "../components/ProjectList";
import CreateProjectForm from "../pages/CreateProject";
import EmployeeTable from "../pages/EmployeeList";
import EmployeeProfile from "../pages/EmployeeProfile";
import ResetPasswordPage from "../pages/ResetPasswordPage";

function AppRoutes() {
  // Example role from logged-in user
const userRole: string = localStorage.getItem('role');
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}
  <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route element={<ProtectedLayout />}>
        {/* <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} /> */}
      </Route>


        <Route path="/" element={<DashboardLayout role={userRole} />}>
          {/* Developer */}
          <Route index element={<h2>Welcome to Dashboard</h2>} /> 
          <Route path="projects" element={<Projects />} />
          <Route path="profile" element={<EmployeeProfile />} />

          {/* Manager */}
          <Route path="team-projects" element={<Projects />} />
          <Route path="employees" element={<EmployeeTable />} />

          {/* HR */}
            <Route path="register" element={<Register />} />

          {/* Admin */}
          <Route path="add-project" element={<CreateProjectForm />} />
        </Route>
    </Routes>
  );
}

export default AppRoutes;
