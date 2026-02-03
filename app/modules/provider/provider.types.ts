export interface Provider {
  id: number;
  name: string;
  is_active: boolean;
}

export interface ProviderResponse {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
