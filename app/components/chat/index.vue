<template>
  <div
    ref="messagesContainer"
    class="chat-container px-8 d-flex flex-column align-center"
  >
    <div
      v-if="chatStarted"
      v-for="message in messagesStore.messages"
      :key="message.id"
      class="w-100 mb-8"
    >
      <SentMessage v-if="message.role === 'user'" :text="message.content" />
      <ReceivedMessage
        v-if="message.role === 'assistant'"
        :text="message.content"
      />
    </div>

    <div ref="bottomEl" />

    <h2 v-if="!chatStarted" class="text-h4 mb-8">
      What do you want to generate?
    </h2>

    <div class="chat-input-wrapper w-100">
      <ChatInput @send-message="handleSendMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatInput from "./ChatInput.vue";
import SentMessage from "./SentMessage.vue";
import ReceivedMessage from "./ReceivedMessage.vue";
import type { MessagePayload } from "~/modules/message/message.types";

const messagesStore = useMessagesStore();

const messagesContainer = ref<HTMLElement | null>(null);
const bottomEl = ref<HTMLElement | null>(null);
const chatStarted = ref(false);

onMounted(() => {
  if (messagesContainer.value) {
    observer.observe(messagesContainer.value);
  }
});

const handleSendMessage = async (text: string) => {
  chatStarted.value = true;
  await addMessage({
    chat_id: 1,
    role: "user",
    content: text,
  });
};

const observer = new ResizeObserver(() => {
  bottomEl.value?.scrollIntoView({ block: "end", behavior: "smooth" });
});

const addMessage = async (data: MessagePayload) => {
  await messagesStore.addMessage(data);
};
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
