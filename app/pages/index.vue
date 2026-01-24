<template>
  <div class="wrapper-chat h-100 d-flex justify-center align-center">
    <Chat />
  </div>
</template>

<script setup lang="ts">
const chatsStore = useChatsStore();

onMounted(async () => {
  chatsStore.clearCurrentChat();
});
</script>

<style scoped>
.wrapper-chat {
  padding-top: calc(var(--v-layout-top) + 28px);
}
</style>
