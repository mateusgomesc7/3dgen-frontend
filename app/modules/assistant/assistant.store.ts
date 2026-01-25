import { assistantApi } from "./assistant.api";

export const useAssistantsStore = defineStore("assistants", () => {
  const currentAssistant = ref<Assistant | null>(null);

  // Mock
  currentAssistant.value = {
    id: 1,
    name: "Default Assistant",
    provider: "OpenAI",
    model: "gpt-4",
  };

  const getAllAssistants = async (): Promise<Assistant[]> => {
    try {
      return await assistantApi.getAll();
    } catch (error) {
      console.error("Failed to fetch assistants:", error);
      return [];
    }
  };

  return {
    currentAssistant,
    getAllAssistants,
  };
});
