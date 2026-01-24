import { messageApi } from "./message.api";
import type {
  MessagePayload,
  MessageResponse,
  MessageChat,
} from "./message.types";

export const useMessagesStore = defineStore("messages", () => {
  const messages = ref<Array<MessageChat>>([]);
  const loading = ref(false);
  const loadingSendMessage = ref(false);

  const sendMessage = async (data: MessageChat) => {
    loadingSendMessage.value = true;
    try {
      messages.value.push(data);
      const response = await messageApi.create(data);
      messages.value.push(response);
    } catch (error) {
      console.error("Failed to create message:", error);
    } finally {
      loadingSendMessage.value = false;
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
    loadingSendMessage,
    sendMessage,
    updateMessage,
  };
});
