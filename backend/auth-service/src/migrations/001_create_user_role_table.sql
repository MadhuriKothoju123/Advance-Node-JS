-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE
    users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name VARCHAR(100),
        reporting_to_id UUID REFERENCES users (id),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW (),
        updated_at TIMESTAMP DEFAULT NOW ()
    );

-- Create departments table
CREATE TABLE
    IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
    );

-- Insert sample departments
-- INSERT INTO
--     departments (name)
-- VALUES
--     ('HR'),
--     ('Delivery'),
--     ('Business Management');

-- Create roles table (with auto-generated PK and nullable department_id)
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    department_id INT REFERENCES departments(id) ON DELETE CASCADE
);
-- Create user_roles table
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    department_id INT REFERENCES departments(id) ON DELETE CASCADE,
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW ()
);

ALTER TABLE users
ADD COLUMN role_id INT REFERENCES roles(id) ON DELETE SET NULL,
ADD COLUMN department_id INT REFERENCES departments(id) ON DELETE SET NULL;

-- Insert roles without requiring department_id
-- INSERT INTO
--     roles (name, department_id)
-- VALUES
--     ('Admin', NULL),
--     ('Technical Manager', NULL),
--     ('Software Engineer', NULL),
--     ('HR', NULL);