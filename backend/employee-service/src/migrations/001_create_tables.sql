CREATE TABLE technologies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL 
);

-- Employee skills table
CREATE TABLE employee_skills (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    technology_id INT REFERENCES technologies(id) ON DELETE CASCADE,
    experience_years DECIMAL(3,1),
    UNIQUE(user_id, technology_id)  -- fixed column name and removed extra comma
);

-- Employee projects table
CREATE TABLE employee_projects (
    id SERIAL PRIMARY KEY,
    employee_id UUID REFERENCES users(id) ON DELETE CASCADE,  -- changed INT → UUID
    project_id INT
);