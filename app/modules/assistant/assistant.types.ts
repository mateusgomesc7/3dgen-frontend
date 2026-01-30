export interface AssistantPayload {
  name: string;
  provider: string;
  model: string;
}

export interface Assistant {
  id: number;
  name: string;
  provider: string;
  model: string;
  is_active: boolean;
}

export interface AssistantResponse {
  id: number;
  name: string;
  provider: string;
  model: string;
  is_active: boolean;
}
