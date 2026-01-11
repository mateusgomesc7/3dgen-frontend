import { api } from "@/services/api";
import type { MessagePayload } from "./message.types";

export const messageApi = {
  create(data: MessagePayload): Promise<MessageResponse> {
    return api("/messages", { method: "POST", body: data });
  },
};
