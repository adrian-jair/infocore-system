export type RoleType = 'ROLE_ADMIN' | 'ROLE_GERENTE' | 'ROLE_RESPONSABLE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  roleDisplay: string;
  area: string;
  active: boolean;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  user: User;
}

export interface AuditLog {
  id: string;
  date: string;
  user: string;
  action: string;
  entity: string;
  detail: string;
}
