import { api } from "@/services/api";
import type { AssistantPayload, AssistantResponse } from "./assistant.types";

export const assistantApi = {
  getAll(params?: { is_active?: boolean }): Promise<AssistantResponse[]> {
    return api("/assistants/", { method: "GET", params });
  },

  getById(id: number): Promise<AssistantResponse> {
    return api(`/assistants/${id}`);
  },

  create(data: AssistantPayload): Promise<AssistantResponse> {
    return api("/assistants/", { method: "POST", body: data });
  },

  update(id: number, data: AssistantPayload): Promise<AssistantResponse> {
    return api(`/assistants/${id}`, { method: "PUT", body: data });
  },

  delete(id: number): Promise<AssistantResponse> {
    return api(`/assistants/${id}`, { method: "DELETE" });
  },

  sync(): Promise<AssistantResponse[]> {
    return api("/assistants/sync", { method: "POST" });
  },
};
