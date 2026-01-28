<template>
  <v-row>
    <v-col cols="12" class="d-flex ga-4 align-center">
      <div class="font-weight-bold">Current Model</div>
      <v-btn
        :disabled="props.loading"
        append-icon="mdi-open-in-new"
        size="small"
        color="white"
        text="New"
        href="https://ollama.com/search"
        target="_blank"
      />
    </v-col>

    <v-col cols="11">
      <v-autocomplete
        :model-value="assistantsStore.currentAssistant"
        :items="props.models"
        :loading="props.loading"
        :disabled="props.loading"
        variant="outlined"
        item-title="name"
        item-value="id"
        return-object
        @update:model-value="(val) => assistantsStore.setCurrentAssistant(val)"
      />
    </v-col>

    <v-col cols="1" class="px-0 pt-5 d-flex justify-center">
      <ConfirmationDialog
        title="Confirm Deletion"
        confirmText="Are you sure you want to delete the current model?"
        @confirm="deleteCurrentModel"
      >
        <template #activator>
          <v-btn
            :disabled="props.loading || !assistantsStore.currentAssistant"
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

const props = defineProps<{
  models: Assistant[];
  loading: boolean;
}>();

const assistantsStore = useAssistantsStore();

const deleteCurrentModel = async () => {
  if (!assistantsStore.currentAssistant || !assistantsStore.currentAssistant.id)
    return;

  const response = await assistantsStore.deleteAssistant(
    assistantsStore.currentAssistant.id,
  );

  if (!response) return;

  const nextModel = props.models.length > 0 ? props.models[0] : null;

  if (nextModel) {
    assistantsStore.setCurrentAssistant(nextModel);
    return;
  }

  assistantsStore.setCurrentAssistant(null);
};
</script>
