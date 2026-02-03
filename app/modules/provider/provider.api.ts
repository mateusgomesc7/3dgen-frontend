import { api } from "@/services/api";
import type { ProviderResponse } from "./provider.types";
import type { ModelResponse } from "@/modules/model/model.types";

export const providerApi = {
  getAll(params?: { is_active?: boolean }): Promise<ProviderResponse[]> {
    return api("/providers/", { method: "GET", params });
  },

  getById(id: number): Promise<ProviderResponse> {
    return api(`/providers/${id}`);
  },

  getModels(providerId: number): Promise<ModelResponse[]> {
    return api(`/providers/${providerId}/models`, { method: "GET" });
  },

  sync(providerId: number): Promise<string> {
    return api(`/providers/sync/${providerId}`, { method: "POST" });
  },
};
