<template>
  <div ref="messagesContainer" class="px-8 d-flex flex-column align-center">
    <v-row
      v-if="hasMessages"
      v-for="message in messagesStore.messages"
      :key="message.id"
      no-gutters
      class="w-100 mb-8"
    >
      <v-col
        v-if="message.role === 'user'"
        :cols="hasAnyCodeOpened ? 9 : 12"
        :class="hasAnyCodeOpened ? 'pr-2' : ''"
      >
        <MarkdownMessage :text="message.content" :role="message.role" />
      </v-col>

      <v-col
        v-if="message.role === 'assistant'"
        :cols="openCodes[message.id] || transitioning[message.id] ? 6 : 12"
      >
        <ThreeSandbox
          :code="message.content"
          :sandbox-id="message.id"
          @open-code="
            shouldAutoScroll = false;
            openCodes[message.id] = !openCodes[message.id];
          "
        />
      </v-col>

      <v-col cols="6" v-if="message.role === 'assistant'">
        <v-expand-x-transition
          @before-enter="transitioning[message.id] = true"
          @after-leave="transitioning[message.id] = false"
        >
          <div v-show="openCodes[message.id]">
            <CodeEditorMessage
              :model-value="draftContent[message.id] ?? message.content"
              :role="message.role"
              @update:modelValue="onEditorInput(message.id, $event)"
              :loading="editorLoading[message.id]"
            />
          </div>
        </v-expand-x-transition>
      </v-col>
    </v-row>

    <div ref="bottomEl" />

    <h2 v-if="!hasMessages" class="text-h4 mb-8">
      What do you want to generate?
    </h2>

    <div class="chat-input-wrapper">
      <ChatInput @send-message="handleSendMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatInput from "./ChatInput.vue";
import MarkdownMessage from "./MarkdownMessage.vue";
import ThreeSandbox from "./ThreeSandbox.vue";
import CodeEditorMessage from "./CodeEditorMessage.vue";
import type { MessagePayload } from "~/modules/message/message.types";

const messagesStore = useMessagesStore();
const chatsStore = useChatsStore();
const router = useRouter();

const shouldAutoScroll = ref(true);
const messagesContainer = ref<HTMLElement | null>(null);
const bottomEl = ref<HTMLElement | null>(null);
const openCodes = reactive<Record<number, boolean>>({});
const transitioning = reactive<Record<number, boolean>>({});
const draftContent = reactive<Record<number, string>>({});
const debounceTimers = reactive<Record<number, ReturnType<typeof setTimeout>>>(
  {},
);
const editorLoading = reactive<Record<number, boolean>>({});

onMounted(() => {
  if (messagesContainer.value) {
    observer.observe(messagesContainer.value);
  }
});

const handleSendMessage = async (text: string) => {
  shouldAutoScroll.value = true;

  if (chatsStore.currentChat === null) {
    const response = await chatsStore.createChat();
    if (!response) return;
    router.replace({
      query: { chatId: response.id.toString() },
    });
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

const onEditorInput = (id: number, value: string) => {
  draftContent[id] = value;
  editorLoading[id] = true;

  clearTimeout(debounceTimers[id]);
  debounceTimers[id] = setTimeout(() => {
    const msg = messagesStore.messages.find((m) => m.id === id);
    if (msg) {
      msg.content = value;
    }

    editorLoading[id] = false;
  }, 800);
};

const hasMessages = computed(() => {
  return messagesStore.messages.length > 0;
});

const hasAnyCodeOpened = computed(() => {
  return Object.values(openCodes).some((isOpen) => isOpen);
});
</script>

<style scoped lang="scss">
.chat-container {
  width: 840px;
  margin: 0 auto;
}

.chat-input-wrapper {
  position: sticky;
  bottom: 0;
  z-index: 10;
  background: rgba(var(--v-theme-surface));
  width: 784px;
  padding-bottom: 10px;
  border-radius: 30px 30px 0 0;
  justify-items: center;
}
</style>
