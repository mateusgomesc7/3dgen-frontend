<template>
  <v-app-bar app name="app-bar">
    <v-app-bar-title>3DGen</v-app-bar-title>
    <template v-slot:prepend v-if="mobile">
      <v-btn
        variant="text"
        class="cursor-pointer ml-4"
        @click="emits('toggle-drawer')"
        size="30"
      >
        <v-icon size="25">mdi-menu</v-icon>
      </v-btn>
    </template>
    <template v-slot:append>
      <configuration-dialog
        v-model="configurationsStore.showConfigurationDialog"
      />
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const emits = defineEmits(["toggle-drawer"]);

const configurationsStore = useConfigurationsStore();
const { mobile } = useDisplay();
</script>
