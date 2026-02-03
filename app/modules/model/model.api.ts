import { api } from "@/services/api";
import type { ModelPayload, ModelResponse } from "./model.types";

export const modelApi = {
  getAll(params?: { is_active?: boolean }): Promise<ModelResponse[]> {
    return api("/models/", { method: "GET", params });
  },

  getById(id: number): Promise<ModelResponse> {
    return api(`/models/${id}`);
  },

  create(data: ModelPayload): Promise<ModelResponse> {
    return api("/models/", { method: "POST", body: data });
  },

  update(id: number, data: ModelPayload): Promise<ModelResponse> {
    return api(`/models/${id}`, { method: "PUT", body: data });
  },

  delete(id: number): Promise<ModelResponse> {
    return api(`/models/${id}`, { method: "DELETE" });
  },
};
