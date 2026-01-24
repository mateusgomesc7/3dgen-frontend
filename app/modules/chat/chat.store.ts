import { chatApi } from "./chat.api";
import type { ChatResponse, ChatCurrent } from "./chat.types";

export const useChatsStore = defineStore("chats", () => {
  const messagesStore = useMessagesStore();
  const usersStore = useUsersStore();
  const assistantsStore = useAssistantsStore();

  const chats = ref<Array<ChatResponse>>([]);
  const currentChat = ref<ChatCurrent | null>(null);
  const loading = ref(false);

  const clearCurrentChat = () => {
    currentChat.value = null;
    messagesStore.messages = [];
  };

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

  const getMessagesByChatId = async (
    id: number,
  ): Promise<MessageResponse[]> => {
    loading.value = true;
    try {
      const response = await chatApi.getMessages(id);
      currentChat.value = { id };
      messagesStore.messages = response;
      return response;
    } catch (error) {
      console.error("Failed to fetch messages by chat ID:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const createChat = async (): Promise<ChatResponse> => {
    loading.value = true;
    try {
      const payload = {
        user_id: usersStore.currentUser?.id!,
        assistant_id: assistantsStore.currentAssistant?.id!,
      };
      const newChat = await chatApi.create(payload);
      currentChat.value = newChat;
      chats.value.unshift(newChat);
      return newChat;
    } catch (error) {
      console.error("Failed to create chat:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    chats,
    currentChat,
    loading,
    clearCurrentChat,
    getAllChats,
    getMessagesByChatId,
    createChat,
  };
});
