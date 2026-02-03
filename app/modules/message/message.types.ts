export interface MessagePayload {
  chat_id: number;
  model_id: number;
  role: string;
  content: string;
}

export interface MessageResponse {
  id: number;
  chat_id: number;
  model_id: number;
  role: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface MessageChat {
  id?: number;
  chat_id: number;
  model_id: number;
  role: string;
  content: string;
}
