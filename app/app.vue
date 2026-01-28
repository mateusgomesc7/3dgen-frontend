<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage />

      <Snackbar />
    </v-app>
  </NuxtLayout>
</template>

<script setup lang="ts">
import Snackbar from "@/components/common/Snackbar.vue";
</script>
