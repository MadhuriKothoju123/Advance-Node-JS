import { Request, Response } from "express";
import { getAllDepartments, getReportingManagersAndLeads, getRolesByDepartmentId } from "../repositories/departmentAndRolesRepositiory";
import redisClient from "../utils/redisClient";


export async function getDepartments(req: Request, res: Response) {
  try {
    const cacheKey = "departments";
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("Serving from Redis Cache");
      console.log(cached, "cached")
      return res.json(JSON.parse(cached));
    }

    // 2. Fetch from DB
    const departments = await getAllDepartments();
console.log(departments, "departments")
    // 3. Store in Redis
    await redisClient.setEx(cacheKey, 300, JSON.stringify(departments)); // 5 min cache

    res.json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getRoles(req: Request, res: Response) {
  try {
    const departmentId = parseInt(req.params.departmentId || req.query.departmentId as string);

    if (isNaN(departmentId)) {
      return res.status(400).json({ message: "Invalid department ID" });
    }

    const roles = await getRolesByDepartmentId(departmentId);
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getManagersAndLeads(req: Request, res: Response) {
  try {
    const employees = await getReportingManagersAndLeads();
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}