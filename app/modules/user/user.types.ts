export interface UserPayload {
  name: string;
}

export interface User {
  id?: number;
  name: string;
}

export interface UserResponse {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
