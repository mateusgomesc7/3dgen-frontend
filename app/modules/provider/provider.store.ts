import { providerApi } from "./provider.api";

export const useProvidersStore = defineStore("providers", () => {
  const currentProvider = ref<Provider | null>(
    localStorage.getItem("3dgen_currentProvider")
      ? JSON.parse(localStorage.getItem("3dgen_currentProvider") as string)
      : null,
  );

  const setCurrentProvider = (provider: Provider | null) => {
    currentProvider.value = provider;
    localStorage.setItem("3dgen_currentProvider", JSON.stringify(provider));
  };

  const getAllProviders = async (): Promise<Provider[]> => {
    try {
      const params = { is_active: true };
      return await providerApi.getAll(params);
    } catch (error) {
      console.error("Failed to fetch providers:", error);
      return [];
    }
  };

  const gelModelsByProvider = async (providerId: number): Promise<Model[]> => {
    try {
      return await providerApi.getModels(providerId);
    } catch (error) {
      console.error("Failed to fetch provider models:", error);
      return [];
    }
  };

  const syncProviderModels = async (providerId: number): Promise<string> => {
    try {
      return await providerApi.sync(providerId);
    } catch (error) {
      console.error("Failed to sync providers:", error);
      return "";
    }
  };

  return {
    currentProvider,
    getAllProviders,
    gelModelsByProvider,
    setCurrentProvider,
    syncProviderModels,
  };
});
