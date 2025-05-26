import { UserRole } from './enums';

export interface User {
  id: number;
  email: string;
  password?: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
} 