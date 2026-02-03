<template>
  <v-layout>
    <NavigationDrawer />

    <TopBar />

    <v-main>
      <slot />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import NavigationDrawer from "@/components/layout-default/NavigationDrawer.vue";
import TopBar from "@/components/layout-default/TopBar.vue";
</script>

<style scoped>
.v-main {
  padding-left: var(--v-layout-left) !important;
  padding-top: 0 !important;
}

.v-main :deep(.v-application) {
  background-color: rgba(var(--v-theme-surface)) !important;
}
</style>
