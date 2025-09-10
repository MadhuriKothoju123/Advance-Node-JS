import axios from "axios";
import { pool } from "../config/db";
import e from "cors";


export async function getProjectsByIds(projectIds: number[]) {
  const query = `
    SELECT id, name, description, start_date, end_date
    FROM projects
    WHERE id = ANY($1)
  `;
  const result = await pool.query(query, [projectIds]);
  return result.rows;
}

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:4000"; 

export async function getEmployeesReportingToManager(managerId: any , token: string) {
  try {
    const response = await axios.get(
      `${AUTH_SERVICE_URL}/reporting-to/${managerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // forward JWT
        },
      }
    );
    console.log(response.data, "response.data reporting");
    
    return response.data; // list of employees
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch employees");
  }
}
export async function getProjectsByEmployees(employeeIds: string[]) {
  const result = await pool.query(
    `
    SELECT DISTINCT 
      p.id, p.name, p.description, p.start_date, p.end_date
    FROM projects p
    JOIN project_employees pe ON pe.project_id = p.id
    WHERE pe.employee_id = ANY($1::uuid[])
    `,
    [employeeIds]
  );
  return result.rows;
}

export async function getEmployeesInProjects(projectIds: number[]) {
  const result = await pool.query(
    `
    SELECT 
      pe.project_id, 
      u.id, u.full_name, u.email
    FROM project_employees pe
    JOIN users u ON u.id = pe.employee_id
    WHERE pe.project_id = ANY($1::int[])
    `,
    [projectIds]
  );
  return result.rows;
}

export async function getTechnologiesInProjects(projectIds: number[]) {
  const result = await pool.query(
    `
    SELECT 
      pt.project_id, 
      t.id, t.name
    FROM project_technologies pt
    JOIN technologies t ON t.id = pt.technology_id
    WHERE pt.project_id = ANY($1::int[])
    `,
    [projectIds]
  );
  return result.rows;
}
export const getAllProjectsWithDetails = async () => {
  const query = `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.start_date,
      p.end_date,
      json_agg(DISTINCT jsonb_build_object(
        'id', u.id,
        'fullName', u.full_name,
        'email', u.email,
        'roleInProject', pe.role_in_project
      )) FILTER (WHERE u.id IS NOT NULL) AS employees,
      json_agg(DISTINCT jsonb_build_object(
        'id', t.id,
        'name', t.name
      )) FILTER (WHERE t.id IS NOT NULL) AS technologies
    FROM projects p
    LEFT JOIN project_employees pe ON p.id = pe.project_id
    LEFT JOIN users u ON pe.employee_id = u.id
    LEFT JOIN project_technologies pt ON p.id = pt.project_id
    LEFT JOIN technologies t ON pt.technology_id = t.id
    GROUP BY p.id, p.name, p.description, p.start_date, p.end_date
    ORDER BY p.start_date DESC;
  `;

  const { rows } = await pool.query(query);
  return rows;
};

export const getAllProjectsWithEmployeesAndTechnologies=async()=> {
    const result = await pool.query(
      `
    SELECT 
      p.id AS project_id,
      p.name AS project_name,
      p.description,
      p.start_date,
      p.end_date,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object(
          'id', e.id,
          'name', e.full_name,
          'role_in_project', pe.role_in_project
        )) FILTER (WHERE e.id IS NOT NULL),
        '[]'::json
      ) AS employees,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object(
          'id', t.id,
          'name', t.name
        )) FILTER (WHERE t.id IS NOT NULL),
        '[]'::json
      ) AS technologies
    FROM projects p
    LEFT JOIN project_employees pe ON p.id = pe.project_id
    LEFT JOIN users e ON pe.employee_id = e.id
    LEFT JOIN project_technologies pt ON p.id = pt.project_id
    LEFT JOIN technologies t ON pt.technology_id = t.id
    GROUP BY p.id
    ORDER BY p.start_date DESC;
    `
    );

    return result.rows;
  }

   export const assignEmployeeToProject=async(
    projectId: number,
    employeeId: string,
    assignedBy: any,
    roleInProject: string
  )=> {
    const result = await pool.query(
      `INSERT INTO project_employees (project_id, employee_id, assigned_by, role_in_project)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [projectId, employeeId, assignedBy, roleInProject]
    );
    return result.rows[0];
  }

   export const AddProject=async(
    name: string,
    description: string,
    startDate: string,
    endDate: string | null,
    createdBy: any
  )=> {
    const result = await pool.query(
      `INSERT INTO projects (name, description, start_date, end_date, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description, startDate, endDate, createdBy]
    );
    return result.rows[0];
  }
export async function addTechnologies(projectId: number, technologyIds: number[]) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO project_technologies (project_id, technology_id)
      VALUES ($1, UNNEST($2::int[]))
      ON CONFLICT (project_id, technology_id) DO NOTHING;
    `;
    await client.query(query, [projectId, technologyIds]);
  } finally {
    client.release();
  }
}
export const getProjectsByEmployeeId = async (employeeId: string) => {
  console.log(employeeId, "employeeId");
  
  const result = await pool.query(
    `
    SELECT 
      p.id AS project_id,
      p.name AS project_name,
      p.description,
      p.start_date,
      p.end_date,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object(
          'id', e.id,
          'name', e.full_name,
          'role_in_project', pe.role_in_project
        )) FILTER (WHERE e.id IS NOT NULL),
        '[]'::json
      ) AS employees,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object(
          'id', t.id,
          'name', t.name
        )) FILTER (WHERE t.id IS NOT NULL),
        '[]'::json
      ) AS technologies
    FROM projects p
    JOIN project_employees target_pe 
        ON p.id = target_pe.project_id 
        AND target_pe.employee_id = $1
    LEFT JOIN project_employees pe ON p.id = pe.project_id
    LEFT JOIN users e ON pe.employee_id = e.id
    LEFT JOIN project_technologies pt ON p.id = pt.project_id
    LEFT JOIN technologies t ON pt.technology_id = t.id
    GROUP BY p.id
    ORDER BY p.start_date DESC;
    `,
    [employeeId]
  );
console.log(result.rows, "result.rows")
  return result.rows;
};


