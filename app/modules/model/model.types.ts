export interface ModelPayload {
  name: string;
  provider_id: string;
}

export interface Model {
  id: number;
  name: string;
  provider_id: string;
  is_active: boolean;
}

export interface ModelResponse {
  id: number;
  name: string;
  provider_id: string;
  is_active: boolean;
  last_checked_at?: string;
  created_at: string;
}
