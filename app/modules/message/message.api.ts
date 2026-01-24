import { api } from "@/services/api";
import type { MessagePayload } from "./message.types";

export const messageApi = {
  create(data: MessagePayload): Promise<MessageResponse[]> {
    return api("/messages/", { method: "POST", body: data });
  },

  update(
    messageId: number,
    data: Partial<MessagePayload>,
  ): Promise<MessageResponse> {
    return api(`/messages/${messageId}`, { method: "PUT", body: data });
  },
};
