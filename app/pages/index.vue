<template>
  <div class="h-100 d-flex justify-center align-center">
    <Chat />
  </div>
</template>

<script setup lang="ts">
const chatStore = useChatsStore();

onMounted(async () => {
  await chatStore.getAllChats();
  console.log("Chats loaded:", chatStore.chats);
});
</script>
