import { messageApi } from "./message.api";
import type { MessagePayload, MessageResponse } from "./message.types";

export const useMessagesStore = defineStore("messages", () => {
  const messages = ref<Array<MessageResponse>>([]);
  const loading = ref(false);

  const addMessage = async (data: MessagePayload) => {
    loading.value = true;
    try {
      const response = await messageApi.create(data);
      messages.value.push(...response);
    } catch (error) {
      console.error("Failed to create message:", error);
    } finally {
      loading.value = false;
    }
  };

  const updateMessage = async (
    messageId: number,
    data: Partial<MessagePayload>,
  ): Promise<MessageResponse | null> => {
    loading.value = true;
    try {
      const response = await messageApi.update(messageId, data);
      return response;
    } catch (error) {
      console.error("Failed to update message:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    messages,
    loading,
    addMessage,
    updateMessage,
  };
});
