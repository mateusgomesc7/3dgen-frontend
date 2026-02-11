<template>
  <v-dialog v-model="show" max-width="800" persistent>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" icon="mdi-cog"></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-h5 px-2">
            {{ $t("components.configuration_dialog.title") }}
          </div>

          <v-btn
            icon="mdi-close"
            variant="text"
            @click="isActive.value = false"
          ></v-btn>
        </v-card-title>

        <v-card-text>
          <CurrentProviderModel
            :providers="providers"
            :models="models"
            :loading-providers="loadingProviders"
            :loading-models="loadingModels"
            @sync-provider-models="syncProviderModels"
            @delete-current-model="deleteCurrentModel"
          />

          <CurrentUser :users="users" :loading="loadingUsers" />
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import CurrentProviderModel from "./current-provider-model/index.vue";
import CurrentUser from "./current-user/index.vue";

const componentProps = defineProps<{
  modelValue: boolean;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const modelsStore = useModelsStore();
const providersStore = useProvidersStore();
const usersStore = useUsersStore();
const snackbarStore = useSnackbarStore();
const { t } = useI18n();

const models = ref<Model[]>([]);
const providers = ref<Provider[]>([]);
const users = ref<User[]>([]);
const loadingModels = ref(false);
const loadingProviders = ref(false);
const loadingUsers = ref(false);

const loadProviders = async () => {
  loadingProviders.value = true;
  providers.value = await providersStore.getAllProviders();
  loadingProviders.value = false;
};

const loadUsers = async () => {
  loadingUsers.value = true;
  users.value = await usersStore.getAllUsers();
  loadingUsers.value = false;
};

const loadModelsbyProvider = async () => {
  if (!providersStore.currentProvider || !providersStore.currentProvider.id)
    return;
  loadingModels.value = true;

  models.value = await providersStore.gelModelsByProvider(
    providersStore.currentProvider.id,
  );
  if (modelsStore.currentModel) {
    const exists = models.value.find(
      (m) => m.id === modelsStore.currentModel?.id,
    );
    if (!exists) {
      const nextModel = models.value.length > 0 ? models.value[0] : null;
      if (nextModel) {
        modelsStore.setCurrentModel(nextModel);
      } else {
        modelsStore.setCurrentModel(null);
      }
    }
  }

  loadingModels.value = false;
};

const syncProviderModels = async () => {
  loadingProviders.value = true;
  loadingModels.value = true;

  if (providersStore.currentProvider && providersStore.currentProvider.id) {
    await providersStore.syncProviderModels(providersStore.currentProvider.id);
  }
  models.value = await providersStore.gelModelsByProvider(
    providersStore.currentProvider?.id ?? 0,
  );

  loadingProviders.value = false;
  loadingModels.value = false;
};

const deleteCurrentModel = async () => {
  if (!modelsStore.currentModel || !modelsStore.currentModel.id) return;

  const response = await modelsStore.deleteModel(modelsStore.currentModel.id);

  if (!response) return;

  models.value = models.value.filter(
    (m) => m.id !== modelsStore.currentModel?.id,
  );
  const nextModel = models.value.length > 0 ? models.value[0] : null;

  if (nextModel) {
    modelsStore.setCurrentModel(nextModel);
    snackbarStore.showSnackbar(
      t("components.configuration_dialog.messages.model_deleted_success"),
      "success",
    );
    return;
  }

  modelsStore.setCurrentModel(null);
};

const show = computed({
  get: () => componentProps.modelValue,
  set: (val: boolean) => {
    emits("update:modelValue", val);
  },
});

watch(show, async (newVal) => {
  if (!newVal) return;

  await Promise.all([loadProviders(), loadUsers()]);
});

watch(
  () => providersStore.currentProvider,
  async () => {
    await loadModelsbyProvider();
  },
  { immediate: true },
);
</script>
