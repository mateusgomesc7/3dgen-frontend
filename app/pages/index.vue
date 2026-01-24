<template>
  <div class="wrapper-chat h-100 d-flex justify-center align-center">
    <Chat />
  </div>
</template>

<script setup lang="ts">
const chatsStore = useChatsStore();
const route = useRoute();

watch(
  () => route.query.chatId,
  (id) => {
    if (id) {
      chatsStore.getMessagesByChatId(Number(id));
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.wrapper-chat {
  padding-top: calc(var(--v-layout-top) + 28px);
}
</style>
