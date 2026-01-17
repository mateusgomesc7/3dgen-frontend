import { chatApi } from "./chat.api";
import type { ChatResponse } from "./chat.types";

export const useChatsStore = defineStore("chats", () => {
  const messagesStore = useMessagesStore();

  const chats = ref<Array<ChatResponse>>([]);
  const loading = ref(false);

  const getAllChats = async () => {
    loading.value = true;
    try {
      const response = await chatApi.getAll();
      chats.value = response;
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    } finally {
      loading.value = false;
    }
  };

  const getMessagesByChatId = async (id: number) => {
    loading.value = true;
    try {
      const response = await chatApi.getMessages(id);
      messagesStore.messages = response;
      return response;
    } catch (error) {
      console.error("Failed to fetch messages by chat ID:", error);
    } finally {
      loading.value = false;
    }
  };

  return {
    chats,
    loading,
    getAllChats,
    getMessagesByChatId,
  };
});
