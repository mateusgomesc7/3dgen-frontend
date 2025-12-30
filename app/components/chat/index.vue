<template>
  <div
    ref="messagesContainer"
    class="chat-container px-8 d-flex flex-column align-center"
  >
    <div
      v-if="chatStarted"
      v-for="message in messages"
      :key="message.id"
      class="w-100 mb-8"
    >
      <SentMessage :text="message.sentText" />
      <ReceivedMessage :text="message.receivedText" />
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

<script setup>
import ChatInput from "./ChatInput.vue";
import SentMessage from "./SentMessage.vue";
import ReceivedMessage from "./ReceivedMessage.vue";

const messagesContainer = ref(null);
const bottomEl = ref(null);
const chatStarted = ref(false);
const messages = ref([
  {
    id: 1,
    sentText: "Hello! How can I help you today?",
    receivedText: "I'm looking to generate some ideas.",
  },
]);

const handleSendMessage = async (text) => {
  chatStarted.value = true;
  const newMessage = {
    id: messages.value.length + 1,
    sentText: text,
    receivedText: "This is a placeholder response.",
  };
  messages.value.push(newMessage);
};

const observer = new ResizeObserver(() => {
  bottomEl.value?.scrollIntoView({ block: "end", behavior: "smooth" });
});

onMounted(() => {
  observer.observe(messagesContainer.value);
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
