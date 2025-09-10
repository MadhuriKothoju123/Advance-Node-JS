import { pool } from "../config/db";

import {
  getEmployeeById,
  updateEmployeePassword,
} from "../queries/employeeQueries";
import axios from "axios";
const PROJECT_SERVICE_URL =
  process.env.PROJECT_SERVICE_URL || "http://project-service:5002";
export class EmployeeRepository {
  /**
   * Get employee details by ID
   */
  async getById(employeeId: string) {
    try {
      const result = await pool.query(getEmployeeById(), [employeeId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error fetching employee:", error);
      throw new Error("Error fetching employee data");
    }
  }

  /**
   * Update employee password
   */
  async updatePassword(employeeId: string, hashedPassword: string) {
    try {
      await pool.query(updateEmployeePassword(), [hashedPassword, employeeId]);
    } catch (error) {
      console.error("Error updating password:", error);
      throw new Error("Error updating employee password");
    }
  }
  async getEmployeeTechnologiesAndSkills(userId: any) {
    const query = `
    SELECT 
      es.id,
      es.user_id,
      t.id AS technology_id,
      t.name AS technology_name,
      es.experience_years
    FROM employee_skills es
    JOIN technologies t ON es.technology_id = t.id
    WHERE es.user_id = $1
  `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }
  async fetchEmployeeProjects(employeeId: string) {
    const assignments = await this.getAssignedProjectIds(employeeId);
    if (assignments.length === 0) return [];

    const projectIds = assignments.map((a: any) => a.project_id);

    // Call Project Service to fetch details
    const { data: projects } = await axios.post(
      `${PROJECT_SERVICE_URL}/getProjects`,
      {
        projectIds,
      }
    );

    // Merge project details with assignment metadata
    return assignments.map((a: any) => ({
      ...a,
      project: projects.find((p: any) => p.id === a.project_id),
    }));
  }

  async getAssignedProjectIds(employeeId: string) {
    const query = `
    SELECT project_id, id
    FROM project_employees
    WHERE employee_id = $1
  `;
    const result = await pool.query(query, [employeeId]);
    return result.rows; // contains project_id + metadata
  }
}
export async function getAllTechnologies() {
  const query = `SELECT id, name FROM technologies ORDER BY name ASC`;
  const result = await pool.query(query);
  return result.rows;
}
export async function addEmployeeSkill(
  userId: string,
  technologyId: number,
  experienceYears: number
) {
  const query = `
    INSERT INTO employee_skills (user_id, technology_id, experience_years)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, technology_id) 
    DO UPDATE SET experience_years = EXCLUDED.experience_years
    RETURNING *;
  `;
  const result = await pool.query(query, [
    userId,
    technologyId,
    experienceYears,
  ]);
  return result.rows[0];
}
