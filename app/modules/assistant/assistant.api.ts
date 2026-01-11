import { api } from "@/services/api";
import type { AssistantPayload, AssistantResponse } from "./assistant.types";

export const assistantApi = {
  getAll(): Promise<AssistantResponse[]> {
    return api("/assistants/", { method: "GET" });
  },

  getById(id: string): Promise<AssistantResponse> {
    return api(`/assistants/${id}`);
  },

  create(data: AssistantPayload): Promise<AssistantResponse> {
    return api("/assistants", { method: "POST", body: data });
  },

  update(id: string, data: AssistantPayload): Promise<AssistantResponse> {
    return api(`/assistants/${id}`, { method: "PUT", body: data });
  },

  delete(id: string, data: AssistantPayload): Promise<AssistantResponse> {
    return api(`/assistants/${id}`, { method: "DELETE", body: data });
  },
};
