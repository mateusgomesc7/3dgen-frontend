<template>
  <div class="wrapper-chat h-100 d-flex justify-center align-center">
    <Chat />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const chatsStore = useChatsStore();

onMounted(() => {
  if (!chatsStore.chatJustCreated) {
    chatsStore.clearCurrentChat();
  }
  chatsStore.chatJustCreated = false;
});

const loadChat = async () => {
  if (Number.isNaN(chatId.value)) {
    router.replace("/");
    return;
  }

  try {
    await chatsStore.getMessagesByChatId(chatId.value);
  } catch {
    router.replace("/");
  }
};

const chatId = computed(() => Number(route.params.id));

watch(
  chatId,
  () => {
    if (chatsStore.chatJustCreated) return;
    loadChat();
  },
  { immediate: true },
);
</script>

<style scoped>
.wrapper-chat {
  padding-top: calc(var(--v-layout-top) + 28px);
}
</style>
