import { assistantApi } from "./assistant.api";

export const useAssistantsStore = defineStore("assistants", () => {
  const currentAssistant = ref<Assistant | null>(
    localStorage.getItem("3dgen_currentAssistant")
      ? JSON.parse(localStorage.getItem("3dgen_currentAssistant") as string)
      : null,
  );

  const setCurrentAssistant = (assistant: Assistant | null) => {
    currentAssistant.value = assistant;
    localStorage.setItem("3dgen_currentAssistant", JSON.stringify(assistant));
  };

  const getAllAssistants = async (): Promise<Assistant[]> => {
    try {
      const params = { is_active: true };
      return await assistantApi.getAll(params);
    } catch (error) {
      console.error("Failed to fetch assistants:", error);
      return [];
    }
  };

  const deleteAssistant = async (assistantId: number): Promise<boolean> => {
    try {
      await assistantApi.delete(assistantId);
      return true;
    } catch (error) {
      console.error("Failed to delete assistant:", error);
      return false;
    }
  };

  const syncAssistants = async (): Promise<Assistant[]> => {
    try {
      return await assistantApi.sync();
    } catch (error) {
      console.error("Failed to sync assistants:", error);
      return [];
    }
  };

  return {
    currentAssistant,
    getAllAssistants,
    setCurrentAssistant,
    deleteAssistant,
    syncAssistants,
  };
});
