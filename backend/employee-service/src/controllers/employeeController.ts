import { Request, Response } from "express";
import { addEmployeeSkill, EmployeeRepository, getAllTechnologies } from "../repositories/employeeRepository";
import axios from "axios";
import { pool } from "../config/db";
const employeeRepo = new EmployeeRepository();

export const getEmployeeSkills = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const skills = await employeeRepo.getEmployeeTechnologiesAndSkills(id);

    return res.status(200).json(skills);
  } catch (error) {
    console.error("Error adding employee:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export async function getEmployeeProjects(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params; // employeeId
    const projects = await employeeRepo.fetchEmployeeProjects(id);
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getProjectsManagedByReportees(req: Request, res: Response) {
  try {
    const managerId = req.params.managerId;

    const employeesResult = await pool.query(
      `SELECT id, full_name 
       FROM users 
       WHERE reporting_to_id = $1`,
      [managerId]
    );

    const employees = employeesResult.rows;

    if (employees.length === 0) {
      return res.status(404).json({ message: "No employees reporting to this manager" });
    }

    const employeeIds = employees.map((emp:any ) => emp.id);

    const projectServiceUrl = process.env.PROJECT_SERVICE_URL|| "http://localhost:5002";
    const projectsResponse = await axios.get(
      `${projectServiceUrl}/projects/managed-by`,
      { params: { employeeIds: employeeIds.join(",") } }
    );

    // 3️⃣ Send combined data
    return res.json({
      managerId,
      reportees: employees,
      projects: projectsResponse.data,
    });

  } catch (error) {
    console.error("Error fetching projects for reportees:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getTechnologies(req: Request, res: Response) {
  try {
    const technologies = await getAllTechnologies();
    res.json(technologies);
  } catch (error) {
    console.error("Error fetching technologies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function assignSkill(req: Request, res: Response) {
  try {
    const { userId, technologyId, experienceYears } = req.body;
    if (!userId || !technologyId || !experienceYears) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const skill = await addEmployeeSkill(userId, technologyId, experienceYears);
    res.json(skill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to assign skill" });
  }
}