interface User {
  id: string;
  email: string;
  passwordHash: string;
  roles: string[];  // e.g. ['HR', 'Admin']
  fullName?: string;
}