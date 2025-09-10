import { Router } from "express";
import {
  addEmployeeToProject,
  addTechnologiesToProject,
  createProject,
  getAllProjects,
  getEmployeeProjects,
  getProjectsDetailsByIds,
  getProjectsManagedByReportees,
} from "../controllers/projectController";
import { asyncHandler } from "../middleware/asyncHandler";
import { authenticate, authorize } from "../middleware/authMiddleware";

const projectRoutes = Router();

projectRoutes.post("/getProjects", asyncHandler(getProjectsDetailsByIds));
projectRoutes.get(
  "/projects/for-manager/:managerId",
  authenticate,
  asyncHandler(getProjectsManagedByReportees)
);
projectRoutes.get(
  "/projects",
  authenticate,
  asyncHandler(getAllProjects)
);
projectRoutes.post(
  "/createProject",
  authenticate,
  authorize(["Admin"]),
  asyncHandler(createProject)
);
projectRoutes.post(
  "/AddTechnologiesToProject",
  authenticate,
  asyncHandler(addTechnologiesToProject)
);
projectRoutes.post(
  "/AddEmployeeToProject",
  authenticate,
  authorize(["Admin", "Technical Manager"]),
  asyncHandler(addEmployeeToProject)
);
projectRoutes.get(
  "/employee/:employeeId",
  authenticate,
  asyncHandler(getEmployeeProjects)
);

export default projectRoutes;
