export interface employee {
  id: string;
  name: string;
  email: string;
  password: string;
  mobile_number: string;
  address: string;
  employee_status?: boolean;
  date_of_join: Date;
}

export interface employeeRoleDetails {
  department_id: string;
  role_id: string;
}

export interface employeeHierarchy {
  reporting_to_id: string;
}

// export type employeeDetails = employee & employeeRoleDetails;
export type omitOnlyPasswordEmployee = Omit<employee, "password">;
export type omitIdEmployee = Omit<employee, "id">;
// export type omitIdRoleDetails = Omit<employeeRoleDetails, "id">;
export type employeeWithHierarchy = Omit<employeeHierarchy, "id">;
export type returnEmployeeDetails= Omit<employee, "password"> & employeeRoleDetails & employeeHierarchy;

export type employeeDetails = omitIdEmployee & employeeRoleDetails &employeeWithHierarchy;

// export type employeeDetails= employeeRoleDetails & employeeHierarchy;