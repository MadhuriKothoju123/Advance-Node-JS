# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
## Intial Setup:
# Firstly locally run build
npm run build

#Run the docker
# connect to the Docker Postgre sql
E:\important\Node-samples\Cognine\backend>docker-compose build
# Do Docker compose UP
E:\important\Node-samples\Cognine\backend>docker-compose up

# connect to Docker Container postgres_db
E:\important\Node-samples\Cognine\backend>docker exec -it postgres_db psql -U postgres -d project_management


# Run the sql scripts of each service

# insert some technologies and departments and role

INSERT INTO technologies (name) VALUES
('JavaScript'),
('TypeScript'),
('React'),
('Angular'),
('Vue.js'),
('Node.js'),
('Express.js'),
('PostgreSQL'),
('MongoDB'),
('Redis'),
('Docker'),
('Kubernetes'),
('AWS'),
('Azure'),
('Java'),
('Python'),
('C#'),
('Go'),
('Spring Boot'),
('GraphQL')
ON CONFLICT (name) DO NOTHING;


INSERT INTO departments (id, name) VALUES
(1, 'Human Resources'),
(2, 'Delivery'),
(3, 'Business Management'),
(4, 'Administration')
ON CONFLICT (id) DO NOTHING;


INSERT INTO roles (id, name, department_id) VALUES
(1, 'Technical Manager', 2),
(2, 'Team Lead', 2),
(3, 'software Developer', 2),
(4, 'HR Executive', 1),
(5, 'Recruiter', 1),
(6, 'Admin', 4)
ON CONFLICT (id) DO NOTHING;



# Insert Admin Details

INSERT INTO users (email, password_hash, full_name, role_id, department_id) VALUES ( 'vani@gmail.com', '$2a$10$Ba5lK3JMe3oftWn9VShDj.GwgziWhUduMvnEMbxsKBOsIFObcqM/y', 'Vani Admin', 6, 4 );



# commands for Docker
get the list of containers and there status----docker ps
Build the all the containers----docker-compose build
run all the containers---docker-compose up
build single container---docker build -t my-auth-service . (navigate to that particular service and run the command)

 stop the container---- docker-compose down
test api response when we use nginx ======->   docker exec -it nginx curl -k https://localhost/auth/getDepartments
 
DB:
 
to connect to the DB container and open the psql------docker exec -it postgres_db psql -U postgres -d project_management













