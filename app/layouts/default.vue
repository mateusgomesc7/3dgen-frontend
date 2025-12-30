<template>
  <v-layout class="fill-height">
    <NavigationDrawer />

    <TopBar />

    <v-main class="main-content">
      <slot />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { useLayout } from "vuetify";
import type { SetupContext } from "vue";
import NavigationDrawer from "@/components/layout-default/NavigationDrawer.vue";
import TopBar from "@/components/layout-default/TopBar.vue";

const Child = {
  setup(_props: unknown, ctx: SetupContext) {
    const { getLayoutItem } = useLayout();

    function print(key: string) {
      alert(JSON.stringify(getLayoutItem(key), null, 2));
    }

    return () => (ctx.slots.default ? { print } : null);
  },
};
</script>

<style scoped>
.main-content {
  --v-layout-top: 0px !important;
}
</style>
