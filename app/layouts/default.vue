<template>
  <v-app>
    <v-layout ref="app" class="rounded rounded-md border">
      <NavigationDrawer />

      <TopBar />

      <v-main class="d-flex align-center justify-center" height="100%">
        <v-container height="100%">
          <v-sheet
            border="dashed md"
            class="d-flex justify-center align-center"
            height="100%"
            rounded="lg"
            width="100%"
          >
            <slot />
          </v-sheet>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
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
