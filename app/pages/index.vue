<template>
  <div class="h-100 pt-8 d-flex justify-center align-center">
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
