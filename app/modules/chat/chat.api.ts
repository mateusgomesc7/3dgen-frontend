import { api } from "@/services/api";
import type {
  ChatPayload,
  ChatResponse,
  PaginatedResponse,
} from "./chat.types";
import type { MessageResponse } from "../message/message.types";

export const chatApi = {
  getPaginated(params?: {
    page?: number;
    page_size?: number;
    user_id?: number;
  }): Promise<PaginatedResponse<ChatResponse>> {
    return api("/chats/", {
      method: "GET",
      params: {
        page: params?.page ?? 1,
        page_size: params?.page_size ?? 10,
        user_id: params?.user_id,
      },
    });
  },

  getById(id: number): Promise<ChatResponse> {
    return api(`/chats/${id}`);
  },

  getMessages(chatId: number): Promise<MessageResponse[]> {
    return api(`/chats/${chatId}/messages`, { method: "GET" });
  },

  create(data: ChatPayload): Promise<ChatResponse> {
    return api("/chats/", { method: "POST", body: data });
  },

  update(id: number, data: ChatPayload): Promise<ChatResponse> {
    return api(`/chats/${id}`, { method: "PUT", body: data });
  },

  delete(id: number): Promise<Response> {
    return api(`/chats/${id}`, { method: "DELETE" });
  },

  rename(id: number, name: string): Promise<ChatResponse> {
    return api(`/chats/${id}/rename`, { method: "PATCH", body: { name } });
  },
};
