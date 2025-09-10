// rolesConfig.ts
export type Role =
  | "Technical Manager"
  | "Team Lead"
  | "software Developer"
  | "HR Executive"
  | "Recruiter"
  | "Admin";

interface NavItem {
  path: string;
  label: string;
}


export const roleNavConfig: Record<Role, NavItem[]> = {
  "software Developer": [
    { path: "/projects", label: "My Projects" },
    { path: "/profile", label: "My Profile" },
  ],
  "Technical Manager": [
    { path: "/projects", label: "Project Management" },
    { path: "/employees", label: "Employee Management" },
    { path: "/profile", label: "My Profile" },
  ],
  "Team Lead": [
    { path: "/team-projects", label: "Team Projects" },
    { path: "/employees", label: "Team Members" },
  ],
  "HR Executive": [
    { path: "/employees", label: "Employee Management" },
    { path: "/profile", label: "My Profile" },
    { path: "/register", label: "Register Employee" },

  ],
  Recruiter: [
    { path: "/candidates", label: "Candidates" },
    { path: "/profile", label: "My Profile" },
  ],
  Admin: [
    { path: "/employees", label: "Employee Management" },
    { path: "/projects", label: "Project Management" },
    { path: "/add-project", label: "Add Project" },
     { path: "/profile", label: "My Profile" },
  ],
};