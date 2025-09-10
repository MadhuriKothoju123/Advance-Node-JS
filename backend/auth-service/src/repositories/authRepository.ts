import { pool } from "../config/db";
export async function findUserByEmail(email: string) {
  const query = `
    SELECT 
      u.id, 
      u.password_hash, 
      u.role_id, 
      r.name AS role_name,
      u.full_name, 
      u.email
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.email = $1
  `;

  const res = await pool.query(query, [email]);

  return res.rows[0];
}

export async function findUserById(id: any) {
  const query = `
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.is_active,
      r.name AS role,
      d.name AS department,
      mgr.full_name AS reporting_manager
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    LEFT JOIN departments d ON u.department_id = d.id
    LEFT JOIN users mgr ON u.reporting_to_id = mgr.id
    WHERE u.id = $1
  `;

  const res = await pool.query(query, [id]);
  return res.rows[0];
}

export async function createUser(
  email: string,
  hashedPassword: string,
  fullName: string,
  departmentId: number,
  roleId: number,
  reportingToId: string // should be UUID, not number
) {
  console.log(
    email,
    hashedPassword,
    fullName,
    departmentId,
    roleId,
    reportingToId,
    "user info"
  );

  const res = await pool.query(
    `INSERT INTO users (email, password_hash, full_name, department_id, role_id, reporting_to_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, email, full_name, department_id, role_id, reporting_to_id, created_at, updated_at, is_active`,
    [email, hashedPassword, fullName, departmentId, roleId, reportingToId]
  );

  return res.rows[0]; 
}


export async function getRoleIdByName(roleName: string) {
  const res = await pool.query("SELECT id FROM roles WHERE name = $1", [
    roleName,
  ]);
  return res.rows[0]?.id;
}

export async function assignRoleToUser(userId: number, roleId: number) {
  await pool.query(
    "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
    [userId, roleId]
  );
}

export async function getUserRoles(userId: number) {
  const res = await pool.query(
    `SELECT r.name FROM roles r
     JOIN user_roles ur ON r.id = ur.role_id
     WHERE ur.user_id = $1`,
    [userId]
  );
  return res.rows.map((row: any) => row.name);
}
export async function getEmployeesReportingTo(managerId: string) {
  const query = `
    SELECT 
        u.id,
        u.full_name,
        r.name AS role_name,
        d.name AS department_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    LEFT JOIN departments d ON u.department_id = d.id
    WHERE u.reporting_to_id = $1;
  `;
  
  const result = await pool.query(query, [managerId]);
  return result.rows;
}

export async function getUsers() {
  const query = `
    SELECT 
      u.id,
      u.full_name,
      u.email,
      r.name AS role_name,
      d.name AS department_name,
      m.full_name AS reporting_manager_name,
      json_agg(
        json_build_object(
          'technology', t.name,
          'experience_years', es.experience_years
        )
      ) AS skills
    FROM users u
    LEFT JOIN users m ON u.reporting_to_id = m.id
    LEFT JOIN roles r ON u.role_id = r.id
    LEFT JOIN departments d ON u.department_id = d.id
    LEFT JOIN employee_skills es ON u.id = es.user_id
    LEFT JOIN technologies t ON es.technology_id = t.id
    GROUP BY u.id, r.name, d.name, m.full_name
    ORDER BY u.created_at DESC;
  `;

  const result = await pool.query(query);
  return result.rows;
}
export async function getEmployeesByManager(managerId: string) {
  const query = `
    SELECT 
      u.id,
      u.full_name,
      u.email,
      r.name AS role_name,
      d.name AS department_name,
      m.full_name AS reporting_manager_name,
      COALESCE(
        json_agg(
          json_build_object(
            'technology', t.name,
            'experience_years', es.experience_years
          )
        ) FILTER (WHERE t.name IS NOT NULL),
        '[]'
      ) AS skills
    FROM users u
    LEFT JOIN users m ON u.reporting_to_id = m.id
    LEFT JOIN roles r ON u.role_id = r.id
    LEFT JOIN departments d ON u.department_id = d.id
    LEFT JOIN employee_skills es ON u.id = es.user_id
    LEFT JOIN technologies t ON es.technology_id = t.id
    WHERE u.reporting_to_id = $1
    GROUP BY u.id, r.name, d.name, m.full_name
    ORDER BY u.created_at DESC;
  `;

  const result = await pool.query(query, [managerId]);
  return result.rows;
}

export async function updateUserPassword(userId: string, hashedPassword: string) {
  await pool.query(
    `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
    [hashedPassword, userId]
  );
}