import { api } from "@/services/api";
import type { ChatPayload, ChatResponse } from "./chat.types";
import type { MessageResponse } from "../message/message.types";

export const chatApi = {
  getAll(): Promise<ChatResponse[]> {
    return api("/chats/", { method: "GET" });
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

  delete(id: number, data: ChatPayload): Promise<ChatResponse> {
    return api(`/chats/${id}`, { method: "DELETE", body: data });
  },
};
