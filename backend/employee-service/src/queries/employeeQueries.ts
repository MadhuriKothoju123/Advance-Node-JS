export const getCreateEmployeeQuery = (): string => `
  INSERT INTO employees (name, email, mobile_number, address, date_of_join)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id, name, email, mobile_number, address, date_of_join, employee_status;
`;

export const getEmployeeByEmail = (): string => {
  return `SELECT * FROM employees WHERE email = $1`;
};

export const updatePasswordById=()=>{
  return `UPDATE employees SET password = $1 WHERE id = $2 RETURNING *`
}

export const getEmployeeByIdQuery = (): string => `
  SELECT id, name, email, mobile_number, address, date_of_join
  FROM employees
  WHERE id = $1;
`;

export const getAllEmployeesQuery = (): string => `
  SELECT id, name, email, mobile_number, address, date_of_join
  FROM employees;
`;

export const getUpdateEmployeeQuery = (): string => `
  UPDATE employees
  SET name = $1, email = $2, mobile_number = $3, address = $4, date_of_join = $5, updated_at = NOW()
  WHERE id = $6
  RETURNING *;
`;

export const getEmployeeById= ()=>{
   return `SELECT * FROM employees WHERE id = $1`
}

export const updateEmployeePassword=()=>{
  return `UPDATE employees SET password = $1 WHERE id = $2 RETURNING *`;
}
export const getDeleteEmployeeQuery = (): string => `
  DELETE FROM employees
  WHERE id = $1
  RETURNING id;
`;

export const addRoleAndDeportment = (): string =>
  `INSERT INTO employee_roles (employee_id, role_id, department_id) VALUES ($1,$2, $3)
   RETURNING role_id, department_id;
   `;

export const addHierarchyForEmployee = (): string =>
  ` INSERT INTO employee_hierarchy (employee_id, reporting_to_id) VALUES ($1, $2)
   RETURNING reporting_to_id;`;

export const getEmployeeTechnologiesAndSkillsQuery= ()=>{
  return `SELECT
  t.name AS technology,
  es.experience_years
FROM employee_skills es
JOIN technologies t ON es.technology_id = t.id
WHERE es.user_id = $1;`;
}
   
