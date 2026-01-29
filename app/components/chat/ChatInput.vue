<template>
  <v-textarea
    v-model="text"
    placeholder="Describe the 3D object…"
    variant="outlined"
    width="100%"
    max-width="940px"
    class="thin-scroll"
    rounded="xl"
    bg-color="grey-darken-3"
    base-color="grey-darken-2"
    color="grey-darken-2"
    rows="1"
    max-rows="15"
    auto-grow
    autofocus
    persistent-hint
    :hint="`Model: ${assistantsStore.currentAssistant?.name}`"
    @keydown="onKeyDown"
  >
    <template v-slot:append-inner>
      <v-btn icon @click="generate" variant="plain">
        <v-icon icon="mdi-arrow-up-circle" size="40" />
      </v-btn>
    </template>
  </v-textarea>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  sendMessage: [text: string];
}>();

const assistantsStore = useAssistantsStore();

const text = ref("");

const generate = () => {
  if (!text.value.trim()) return;

  emit("sendMessage", text.value.trim());
  text.value = "";
};

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && e.shiftKey) {
    return;
  }

  if (e.key === "Enter") {
    e.preventDefault();
    generate();
  }
};
</script>

<style scoped>
::v-deep(.thin-scroll .v-field--active .v-field__field) {
  padding-right: 16px !important;
  --v-input-padding-top: 6px !important;
}

/* Chrome / Edge / WebKit */
::v-deep(.thin-scroll .v-field__input::-webkit-scrollbar) {
  width: 6px;
}

::v-deep(.thin-scroll .v-field__input::-webkit-scrollbar-track) {
  background: transparent;
}

::v-deep(.thin-scroll .v-field__input::-webkit-scrollbar-thumb) {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 100px;
}

::v-deep(.thin-scroll .v-field__input::-webkit-scrollbar-thumb:hover) {
  background: rgba(255, 255, 255, 0.35);
}

/* Firefox */
::v-deep(.thin-scroll .v-field__input) {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
}

::v-deep(.v-messages__message) {
  text-align: center;
}
</style>
