<template>
  <v-dialog v-model="show" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" icon="mdi-cog"></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-h5 px-2">Configurations</div>

          <v-btn
            icon="mdi-close"
            variant="text"
            @click="isActive.value = false"
          ></v-btn>
        </v-card-title>

        <v-card-text>
          <CurrentModel
            :models="models"
            :loading="loadingModels"
            @sync-models="synchModels"
          />

          <CurrentUser :users="users" :loading="loadingUsers" />
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import CurrentModel from "./current-model/index.vue";
import CurrentUser from "./current-user/index.vue";

const componentProps = defineProps<{
  modelValue: boolean;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const assistantsStore = useAssistantsStore();
const usersStore = useUsersStore();

const models = ref<Assistant[]>([]);
const loadingModels = ref(false);
const users = ref<User[]>([]);
const loadingUsers = ref(false);

const loadModels = async () => {
  loadingModels.value = true;
  models.value = await assistantsStore.getAllAssistants();
  loadingModels.value = false;
};

const loadUsers = async () => {
  loadingUsers.value = true;
  users.value = await usersStore.getAllUsers();
  loadingUsers.value = false;
};

const synchModels = async () => {
  loadingModels.value = true;
  models.value = await assistantsStore.syncAssistants();
  loadingModels.value = false;
};

const show = computed({
  get: () => componentProps.modelValue,
  set: (val: boolean) => {
    emits("update:modelValue", val);
  },
});

watch(show, async (newVal) => {
  if (!newVal) return;

  await Promise.all([loadModels(), loadUsers()]);
});
</script>
