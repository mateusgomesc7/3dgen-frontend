<template>
  <v-row>
    <v-col cols="12" class="d-flex ga-4 align-center">
      <div class="font-weight-bold">Current Provider and Model</div>
      <v-btn
        v-if="ProviderType.OLLAMA === providersStore.currentProvider?.name"
        :disabled="props.loadingProviders || props.loadingModels"
        append-icon="mdi-open-in-new"
        size="small"
        color="white"
        text="New"
        height="24"
        href="https://ollama.com/search"
        target="_blank"
      />
    </v-col>

    <v-col cols="12" md="5">
      <v-autocomplete
        :model-value="providersStore.currentProvider"
        :items="props.providers"
        :loading="props.loadingProviders"
        :disabled="props.loadingProviders"
        variant="outlined"
        item-title="name"
        item-value="id"
        autocomplete="off"
        return-object
        @update:model-value="(val) => providersStore.setCurrentProvider(val)"
      />
    </v-col>

    <v-col cols="10" md="5">
      <v-autocomplete
        :model-value="modelsStore.currentModel"
        :items="props.models"
        :loading="props.loadingModels"
        :disabled="props.loadingModels"
        variant="outlined"
        item-title="name"
        item-value="id"
        autocomplete="off"
        return-object
        @update:model-value="handleChangeModel"
      />
    </v-col>

    <v-col
      cols="2"
      class="px-0 pt-0 pt-sm-0 pt-md-5 mt-n2 mt-sm-n2 mt-md-0 d-flex justify-center ga-2 flex-column flex-sm-column flex-md-row"
    >
      <v-btn
        :disabled="props.loadingModels"
        icon="mdi-refresh"
        size="small"
        @click="emits('sync-provider-models')"
      />
      <ConfirmationDialog
        title="Confirm Deletion"
        confirmText="Are you sure you want to delete the current model?"
        :disabled="disabledDelete"
        @confirm="emits('delete-current-model')"
      >
        <template #activator>
          <v-btn
            :disabled="disabledDelete"
            size="small"
            icon="mdi-trash-can"
          ></v-btn>
        </template>
      </ConfirmationDialog>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import ConfirmationDialog from "@/components/common/ConfirmationDialog.vue";
import { ProviderType } from "@/modules/provider/provider.enum";

const props = defineProps<{
  providers: Provider[];
  models: Model[];
  loadingProviders: boolean;
  loadingModels: boolean;
}>();

const emits = defineEmits<{
  (e: "sync-provider-models"): void;
  (e: "delete-current-model"): void;
}>();

const providersStore = useProvidersStore();
const modelsStore = useModelsStore();
const snackbarStore = useSnackbarStore();

const handleChangeModel = (model: Model) => {
  if (modelsStore.currentModel && model.id === modelsStore.currentModel.id)
    return;

  modelsStore.setCurrentModel(model);
  snackbarStore.showSnackbar("Current model updated", "info", 1500);
};

const disabledDelete = computed(() => {
  return props.loadingModels || !modelsStore.currentModel;
});
</script>
