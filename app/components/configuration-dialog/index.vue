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
          <CurrentModel :models="models" :loading="loadingModels" />

          <CurrentUser />
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import CurrentModel from "./CurrentModel.vue";
import CurrentUser from "./CurrentUser.vue";

const assistantsStore = useAssistantsStore();

const show = ref(false);
const models = ref<Assistant[]>([]);
const loadingModels = ref(false);

const loadModels = async () => {
  loadingModels.value = true;
  models.value = await assistantsStore.getAllAssistants();
  loadingModels.value = false;
};

watch(show, async (newVal) => {
  if (newVal) {
    await loadModels();
  }
});
</script>
