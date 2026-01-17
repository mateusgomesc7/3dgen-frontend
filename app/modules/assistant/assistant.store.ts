export const useAssistantsStore = defineStore("assistants", () => {
  const currentAssistant = ref<Assistant | null>(null);

  // Mock
  currentAssistant.value = {
    id: 1,
    name: "Default Assistant",
    provider: "OpenAI",
    model: "gpt-4",
  };

  return {
    currentAssistant,
  };
});
