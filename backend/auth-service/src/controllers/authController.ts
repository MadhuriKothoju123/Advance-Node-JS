import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import {
  createUser,
  findUserByEmail,
  findUserById,
  getEmployeesByManager,
  getEmployeesReportingTo,
  getUsers,
  updateUserPassword,
} from "../repositories/authRepository";
import axios from "axios";
import { generateToken } from "../utils/jwt";
import { buildResetEvent } from "../utils/emailEvent";
import { sendWs } from "../utils/websocketClient";

const EMPLOYEE_SERVICE_URL =
  process.env.EMPLOYEE_SERVICE_URL || "http://employee-service:5001";

export async function fetchEmployeeSkills(userId: string) {
  const response = await axios.get(
    `${EMPLOYEE_SERVICE_URL}/employees/${userId}/skills`
  );
  return response.data;
}

export async function register(req: Request, res: Response) {
  const { email, password, roleId, fullName, departmentId, reporitngToId } =
    req.body;

  if (!email || !password || !roleId) {
    return res
      .status(400)
      .json({ message: "Email, password and role required" });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(
      email,
      hashedPassword,
      fullName,
      departmentId,
      roleId,
      reporitngToId
    );
    const ttlMin = Number(process.env.RESET_TOKEN_TTL_MIN || 15);
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: `${ttlMin}m` }
    );
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    sendWs(buildResetEvent(user.email, resetLink, user.full_name));
    res
      .status(201)
      .json({ message: "User registered successfully", user: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid credentials" });
    const token = generateToken({ id: user.id, email, role: user.role_name });
    res.json({ accessToken: token, user: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = req?.user?.id;

    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const response = await axios.get(
      `${EMPLOYEE_SERVICE_URL}/employees/${userId}/skills`
    );
    res.json({ user: user, skills: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getEmployeesReporting(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Manager ID is required" });
    }
    const employees = await getEmployeesReportingTo(id);

    return res.status(200).json({
      message: "Employees reporting to the manager fetched successfully",
      data: employees,
    });
  } catch (error: any) {
    console.error("Error in getEmployeesReportingTo:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
export async function getAllUsers(req: Request, res: Response) {
  try {
    const result = await getUsers();
    res.json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
export async function resetPassword(req: Request, res: Response) {
  const { token, password } = req.body;

  if (!token || !password) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      sub: string;
      email: string;
    };

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Update user’s password
    await updateUserPassword(decoded.sub, hashedPassword);

    return res
      .status(200)
      .json({ message: "Password has been reset successfully" });
  } catch (err: any) {
    console.error("Reset password error:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset token has expired" });
    }

    return res.status(400).json({ message: "Invalid or expired token" });
  }
}
export async function getEmployeesReportingToManagerwithSkills(req: Request, res: Response) {
  try {
    const { managerId } = req.params;

    if (!managerId) {
      return res.status(400).json({ message: "Manager ID is required" });
    }

    const employees = await getEmployeesByManager(managerId);

    if (employees.length === 0) {
      return res.status(404).json({ message: "No employees found reporting to this manager" });
    }

    return res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
