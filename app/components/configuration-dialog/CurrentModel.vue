<template>
  <v-row>
    <v-col cols="12" class="d-flex ga-4 align-center">
      <div>Current Model</div>
      <v-btn
        :disabled="props.loading"
        append-icon="mdi-open-in-new"
        size="small"
        color="white"
        text="New"
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
      <v-btn
        :disabled="props.loading"
        size="small"
        icon="mdi-trash-can"
      ></v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps<{
  models: Assistant[];
  loading: boolean;
}>();

const assistantsStore = useAssistantsStore();
</script>
