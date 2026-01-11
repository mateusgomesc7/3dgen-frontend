export interface UserPayload {
  email: string;
  name: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}
