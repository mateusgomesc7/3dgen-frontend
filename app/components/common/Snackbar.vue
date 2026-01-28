<template>
  <v-snackbar
    v-model="snackbarStore.snackbar.show"
    :timeout="snackbarStore.snackbar.timeout"
    :color="snackbarStore.snackbar.color"
    location="top"
  >
    <v-icon class="mr-2">{{ icon }}</v-icon>

    {{ snackbarStore.snackbar.message }}

    <template #actions>
      <v-btn color="white" variant="text" @click="snackbarStore.hideSnackbar()">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
const snackbarStore = useSnackbarStore();

const icon = computed(() => {
  switch (snackbarStore.snackbar?.color) {
    case "success":
      return "mdi-check-circle";
    case "error":
      return "mdi-alert-circle";
    case "warning":
      return "mdi-alert";
    case "info":
    default:
      return "mdi-information";
  }
});
</script>
