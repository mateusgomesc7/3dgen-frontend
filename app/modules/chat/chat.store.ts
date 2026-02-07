import { chatApi } from "./chat.api";
import type {
  ChatResponse,
  ChatCurrent,
  PaginatedResponse,
} from "./chat.types";

export const useChatsStore = defineStore("chats", () => {
  const messagesStore = useMessagesStore();
  const usersStore = useUsersStore();

  const chats = ref<Array<ChatResponse>>([]);
  const currentChat = ref<ChatCurrent | null>(null);
  const chatJustCreated = ref(false);
  const loading = ref(false);
  const loadingPagination = ref(false);

  const clearCurrentChat = () => {
    currentChat.value = null;
    messagesStore.messages = [];
  };

  const getPaginatedChats = async (params?: {
    page?: number;
    page_size?: number;
    user_id?: number;
  }): Promise<PaginatedResponse<ChatResponse>> => {
    loadingPagination.value = true;
    try {
      const response = await chatApi.getPaginated(params);
      chats.value.push(...response.items);
      return response;
    } catch (error) {
      console.error("Failed to fetch paginated chats:", error);
      throw error;
    } finally {
      loadingPagination.value = false;
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

  const createChat = async (userPrompt: string): Promise<ChatResponse> => {
    loading.value = true;
    chatJustCreated.value = true;

    try {
      const payload = {
        user_id: usersStore.currentUser?.id!,
        user_prompt: userPrompt,
      };
      const newChat = await chatApi.create(payload);
      currentChat.value = newChat;
      chats.value.unshift(newChat);
      return newChat;
    } catch (error) {
      chatJustCreated.value = false;
      console.error("Failed to create chat:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const deleteChat = async (chatId: number): Promise<boolean> => {
    loading.value = true;
    try {
      await chatApi.delete(chatId);

      chats.value = chats.value.filter((chat) => chat.id !== chatId);
      if (currentChat.value?.id === chatId) {
        clearCurrentChat();
      }

      return true;
    } catch (error) {
      console.error("Failed to delete chat:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    chats,
    currentChat,
    chatJustCreated,
    loading,
    loadingPagination,
    clearCurrentChat,
    getPaginatedChats,
    getMessagesByChatId,
    createChat,
    deleteChat,
  };
});
