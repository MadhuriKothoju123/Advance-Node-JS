ALTER TABLE employee_roles 
ADD COLUMN department_id INT NOT NULL REFERENCES departments(id) ON DELETE CASCADE;
