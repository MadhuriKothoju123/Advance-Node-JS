import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler"; // Import the asyncHandler middleware
import { assignSkill, getEmployeeProjects, getEmployeeSkills, getProjectsManagedByReportees, getTechnologies } from "../controllers/employeeController";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const employeeRouters = Router();

employeeRouters.get('/employees/:id/skills', asyncHandler(getEmployeeSkills));
employeeRouters.get(
  "/employee/:id/projects",
  authenticate,
  asyncHandler(getEmployeeProjects)
);
employeeRouters.get(
  "/projects/reportees/:managerId",
  authenticate,
  asyncHandler(getProjectsManagedByReportees)
);
employeeRouters.get(
  "/getTechnologies",
  authenticate,
  asyncHandler(getTechnologies)
);
employeeRouters.post(
  "/assignSkill",
  authenticate,
  asyncHandler(assignSkill)
);


export default employeeRouters;
