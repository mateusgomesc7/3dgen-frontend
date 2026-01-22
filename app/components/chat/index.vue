<template>
  <div
    ref="messagesContainer"
    class="chat-container px-8 d-flex flex-column align-center"
  >
    <div
      v-if="hasMessages"
      v-for="message in messagesStore.messages"
      :key="message.id"
      class="w-100 mb-8"
    >
      <MarkdownMessage
        v-if="openCodes[message.id] || message.role === 'user'"
        :text="message.content"
        :role="message.role"
      />
      <ThreeSandbox
        v-if="message.role === 'assistant'"
        :code="message.content"
        :sandbox-id="message.id"
        @open-code="
          shouldAutoScroll = false;
          openCodes[message.id] = !openCodes[message.id];
        "
      />
    </div>

    <div ref="bottomEl" />

    <h2 v-if="!hasMessages" class="text-h4 mb-8">
      What do you want to generate?
    </h2>

    <div class="chat-input-wrapper w-100">
      <ChatInput @send-message="handleSendMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatInput from "./ChatInput.vue";
import MarkdownMessage from "./MarkdownMessage.vue";
import ThreeSandbox from "./ThreeSandbox.vue";
import type { MessagePayload } from "~/modules/message/message.types";

const messagesStore = useMessagesStore();
const chatsStore = useChatsStore();

const shouldAutoScroll = ref(true);
const messagesContainer = ref<HTMLElement | null>(null);
const bottomEl = ref<HTMLElement | null>(null);
const openCodes = reactive<Record<number, boolean>>({});

onMounted(() => {
  if (messagesContainer.value) {
    observer.observe(messagesContainer.value);
  }
});

const handleSendMessage = async (text: string) => {
  shouldAutoScroll.value = true;

  if (chatsStore.currentChat === null) {
    await chatsStore.createChat();
  }

  if (chatsStore.currentChat === null) return;

  await addMessage({
    chat_id: chatsStore.currentChat.id,
    role: "user",
    content: text,
  });
};

const observer = new ResizeObserver(() => {
  if (!shouldAutoScroll.value) return;

  bottomEl.value?.scrollIntoView({ block: "end", behavior: "smooth" });
});

const addMessage = async (data: MessagePayload) => {
  await messagesStore.addMessage(data);
};

const hasMessages = computed(() => {
  return messagesStore.messages.length > 0;
});
</script>

<style scoped>
.chat-container {
  width: 840px;
  margin: 0 auto;
}

.chat-input-wrapper {
  position: sticky;
  bottom: 0;
  background: rgba(var(--v-theme-surface));
  padding-bottom: 10px;
  border-radius: 30% 30% 0% 0%;
}
</style>
