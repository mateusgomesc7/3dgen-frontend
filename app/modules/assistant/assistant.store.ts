import { assistantApi } from "./assistant.api";

export const useAssistantsStore = defineStore("assistants", () => {
  const currentAssistant = ref<Assistant | null>(
    localStorage.getItem("3dgen_currentAssistant")
      ? JSON.parse(localStorage.getItem("3dgen_currentAssistant") as string)
      : null,
  );

  const setCurrentAssistant = (assistant: Assistant) => {
    currentAssistant.value = assistant;
    localStorage.setItem("3dgen_currentAssistant", JSON.stringify(assistant));
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
    setCurrentAssistant,
  };
});
