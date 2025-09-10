import { Router } from "express";
import {
  getAllUsers,
  getEmployeesReporting,
  getEmployeesReportingToManagerwithSkills,
  getProfile,
  login,
  register,
  resetPassword,
} from "../controllers/authController";
import { asyncHandler } from "../utils/asyncHandler";
import {
  getDepartments,
  getManagersAndLeads,
  getRoles,
} from "../controllers/departmentAndRolesController";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { body } from "express-validator";

const authRouter = Router();

authRouter.post("/login", asyncHandler(login));
authRouter.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isStrongPassword().withMessage("Password too weak"),
  ],
  authenticate,
  authorize(["HR Executive", "Admin"]),
  asyncHandler(register)
);
authRouter.get("/getUserProfile", authenticate, asyncHandler(getProfile));
authRouter.get("/getDepartments", authenticate, asyncHandler(getDepartments));
authRouter.get("/getMangersAndLeads",authenticate, asyncHandler(getManagersAndLeads));
authRouter.get("/roles/:departmentId", authenticate, asyncHandler(getRoles));
authRouter.get(
  "/reporting-to/:id",
  authenticate,
  asyncHandler(getEmployeesReporting)
);
authRouter.get(
  "/getUsers",
  authenticate,
  authorize(["HR Executive", "Admin"]),
  asyncHandler(getAllUsers)
);
authRouter.get(
  "/reporting/:managerId",
  authenticate,
  asyncHandler(getEmployeesReportingToManagerwithSkills)
);

authRouter.post("/reset-password", asyncHandler(resetPassword));
export default authRouter;
