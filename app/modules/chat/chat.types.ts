export interface ChatPayload {
  user_id: number;
  assistant_id: number;
}

export interface Chat {
  id: number;
  user_id: number;
  assistant_id: number;
}

export interface ChatResponse {
  id: number;
  user_id: number;
  assistant_id: number;
  created_at: string;
  updated_at: string;
}

export interface ChatCurrent {
  id: number;
  user_id?: number;
  assistant_id?: number;
  created_at?: string;
  updated_at?: string;
}
