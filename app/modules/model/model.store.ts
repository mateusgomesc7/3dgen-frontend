import { modelApi } from "./model.api";

export const useModelsStore = defineStore("models", () => {
  const currentModel = ref<Model | null>(
    localStorage.getItem("3dgen_currentModel")
      ? JSON.parse(localStorage.getItem("3dgen_currentModel") as string)
      : null,
  );

  const setCurrentModel = (model: Model | null) => {
    currentModel.value = model;
    localStorage.setItem("3dgen_currentModel", JSON.stringify(model));
  };

  const getAllModels = async (): Promise<Model[]> => {
    try {
      const params = { is_active: true };
      return await modelApi.getAll(params);
    } catch (error) {
      console.error("Failed to fetch models:", error);
      return [];
    }
  };

  const deleteModel = async (modelId: number): Promise<boolean> => {
    try {
      await modelApi.delete(modelId);
      return true;
    } catch (error) {
      console.error("Failed to delete model:", error);
      return false;
    }
  };

  return {
    currentModel,
    getAllModels,
    setCurrentModel,
    deleteModel,
  };
});
