import { Request, Response } from "express";
import {
  AddProject,
  addTechnologies,
  assignEmployeeToProject,
  getAllProjectsWithDetails,
  getAllProjectsWithEmployeesAndTechnologies,
  getEmployeesInProjects,
  getEmployeesReportingToManager,
  getProjectsByEmployeeId,
  getProjectsByEmployees,
  getProjectsByIds,
  getTechnologiesInProjects,
} from "../repositories/projectRepository";

export async function getProjectsDetailsByIds(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { projectIds } = req.body;
    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      res.status(400).json({ message: "projectIds are required" });
      return;
    }

    const projects = await getProjectsByIds(projectIds);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProjectsManagedByReportees(
  req: Request,
  res: Response
) {
  try {
    const managerId = req.params.managerId;
    const token = req.headers.authorization?.split(" ")[1];
    if (!managerId) {
      return res.status(400).json({ message: "Invalid managerId" });
    }

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    // 1. Get employees reporting to this manager
    const response = await getEmployeesReportingToManager(managerId, token);

    if (!response.data.length) {
      return res.json({ projects: [] });
    }
    const employeeIds = response.data.map((e: any) => e.id);

    // Step 2: Get projects handled by those employees
    const projects = await getProjectsByEmployees(employeeIds);
    
    if (projects.length === 0) {
      return res.json({ projects: [] });
    }

    const projectIds = projects.map((p) => p.id);

    // Step 3: Get employees assigned to these projects
    const employeesInProjects = await getEmployeesInProjects(projectIds);

    // Step 4: Get technologies used in these projects
    const projectTechnologies = await getTechnologiesInProjects(projectIds);

    // Step 5: Combine results
    const result = projects.map((project) => ({
      ...project,
      employees: employeesInProjects
        .filter((e) => e.project_id === project.id)
        .map((e) => ({
          id: e.id,
          full_name: e.full_name,
          email: e.email,
        })),
      technologies: projectTechnologies
        .filter((t) => t.project_id === project.id)
        .map((t) => ({
          id: t.id,
          name: t.name,
        })),
    }));
    return res.json({ projects: result });
  } catch (error) {
    console.error("Error fetching projects managed by reportees:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await getAllProjectsWithDetails();
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export async function createProject(req: Request, res: Response) {
  try {
    const { name, description, startDate, endDate } = req.body;
    const createdBy = req?.user?.id; // from auth middleware
    const project = await AddProject(
      name,
      description,
      startDate,
      endDate,
      createdBy
    );
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: "Failed to create project" });
  }
}

// Reporting Manager: Assign employee
export async function addEmployeeToProject(req: Request, res: Response) {
  try {
    const { projectId, employeeId, roleInProject } = req?.body;
    const assignedBy = req?.user?.id;
    const assignment = await assignEmployeeToProject(
      projectId,
      employeeId,
      assignedBy,
      roleInProject
    );
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: "Failed to add employee" });
  }
}

// Add technologies
export async function getAllProjects(req: Request, res: Response) {
  try {
    const projects = await getAllProjectsWithEmployeesAndTechnologies();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
}
export async function addTechnologiesToProject(req: Request, res: Response) {
  try {
    const { projectId, technologyIds } = req.body;

    if (!projectId || !Array.isArray(technologyIds) || technologyIds.length === 0) {
      return res.status(400).json({ message: "Project ID and technology IDs are required" });
    }

    await addTechnologies(projectId, technologyIds);

    return res.status(201).json({
      message: "Technologies added to project successfully",
      projectId,
      technologyIds,
    });
  } catch (error: any) {
    console.error("Error adding technologies to project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getEmployeeProjects(req: Request, res: Response) {
  try {
    const { employeeId } = req.params;
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const projects = await getProjectsByEmployeeId(employeeId);

    if (projects.length === 0) {
      return res.status(404).json({ message: "No projects found for this employee" });
    }

    res.json({ projects });
  } catch (err) {
    console.error("Error fetching employee projects:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
