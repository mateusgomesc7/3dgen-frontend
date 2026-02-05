export interface ChatPayload {
  user_id: number;
  user_prompt: string;
}

export interface Chat {
  id: number;
  user_id: number;
  name?: string;
}

export interface ChatResponse {
  id: number;
  user_id: number;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatCurrent {
  id: number;
  user_id?: number;
  name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
  pages: number;
}
