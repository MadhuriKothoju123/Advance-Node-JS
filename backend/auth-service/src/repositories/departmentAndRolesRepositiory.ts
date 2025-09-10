import { pool } from "../config/db";

export async function getAllDepartments() {
  const res = await pool.query(
    "SELECT id, name FROM departments"
  );
  return res.rows;
}


export async function getRolesByDepartmentId(departmentId: number) {
  const res = await pool.query(
    "SELECT id, name FROM roles WHERE department_id = $1",
    [departmentId]
  );
  return res.rows;
}
export async function getReportingManagersAndLeads() {
  const res = await pool.query(
    `SELECT e.id, e.full_name, e.email
     FROM users e
     JOIN roles r ON e.role_id = r.id
     WHERE r.name IN ($1, $2, $3)`,
    ['Technical Manager', 'Team Lead', 'Admin']
  );
  return res.rows;
}

