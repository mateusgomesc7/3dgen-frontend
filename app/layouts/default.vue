<template>
  <v-layout>
    <NavigationDrawer v-model="drawer" />

    <TopBar @toggle-drawer="drawer = !drawer" />

    <v-main>
      <slot />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import NavigationDrawer from "@/components/layout-default/navigation-drawer/index.vue";
import TopBar from "@/components/layout-default/TopBar.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

const drawer = ref(true);

watch(
  () => mobile.value,
  (isMobile) => {
    if (isMobile) {
      drawer.value = false;
    }
  },
  { immediate: true },
);
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
