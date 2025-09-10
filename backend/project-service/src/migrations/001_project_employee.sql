CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE project_technologies (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    technology_id INT REFERENCES technologies(id) ON DELETE CASCADE,
    UNIQUE(project_id, technology_id)
);
CREATE TABLE project_employees (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES users(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id), 
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role_in_project VARCHAR(100) 
);
