import { api } from "@/services/api";
import type { UserPayload, UserResponse } from "./user.types";

export const userApi = {
  getAll(): Promise<UserResponse[]> {
    return api("/users/", { method: "GET" });
  },

  getById(id: string): Promise<UserResponse> {
    return api(`/users/${id}`);
  },

  create(data: UserPayload): Promise<UserResponse> {
    return api("/users/", { method: "POST", body: data });
  },

  update(id: string, data: UserPayload): Promise<UserResponse> {
    return api(`/users/${id}`, { method: "PUT", body: data });
  },

  delete(id: string, data: UserPayload): Promise<UserResponse> {
    return api(`/users/${id}`, { method: "DELETE", body: data });
  },
};
