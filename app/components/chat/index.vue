<template>
  <div
    ref="messagesContainer"
    class="px-8 d-flex flex-column align-center"
    :class="{ 'h-100': hasMessages }"
  >
    <v-row
      v-if="hasMessages"
      v-for="message in messagesStore.messages"
      :key="message.id"
      no-gutters
      class="w-100 mb-8"
    >
      <v-col
        v-if="message.role === 'user'"
        align-self="end"
        class="mb-n8"
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
          :is-dirty="isDirty[message.id]"
          @open-code="openCode(message)"
          @cancel-code="cancelCode(message)"
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
              :loading="editorLoading[message.id]"
              @update:modelValue="onEditorInput(message.id, $event)"
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

    <div v-if="!hasMessages" class="my-12"></div>
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
const originalContent = reactive<Record<number, string>>({});
const isDirty = reactive<Record<number, boolean>>({});
const debounceTimers = reactive<Record<number, ReturnType<typeof setTimeout>>>(
  {},
);
const editorLoading = reactive<Record<number, boolean>>({});

onMounted(() => {
  if (messagesContainer.value) {
    observer.observe(messagesContainer.value);
  }
});

const observer = new ResizeObserver(() => {
  if (!shouldAutoScroll.value) return;

  bottomEl.value?.scrollIntoView({ block: "end", behavior: "smooth" });
});

const handleSendMessage = async (text: string) => {
  shouldAutoScroll.value = true;

  if (chatsStore.currentChat === null) {
    const response = await chatsStore.createChat();
    if (!response) return;
    router.replace(`/chat/${response.id}`);
  }

  if (chatsStore.currentChat === null) return;

  await addMessage({
    chat_id: chatsStore.currentChat.id,
    role: "user",
    content: text,
  });
};

const addMessage = async (data: MessagePayload) => {
  await messagesStore.addMessage(data);
};

const openCode = (message: MessageResponse) => {
  shouldAutoScroll.value = false;
  openCodes[message.id] = !openCodes[message.id];

  if (originalContent[message.id] === undefined) {
    originalContent[message.id] = message.content;
    isDirty[message.id] = false;
  }
};

const cancelCode = (message: MessageResponse) => {
  clearTimeout(debounceTimers[message.id]);

  const original = originalContent[message.id] ?? message.content;

  draftContent[message.id] = original;

  const msg = messagesStore.messages.find((m) => m.id === message.id);
  if (msg) {
    msg.content = original;
  }

  isDirty[message.id] = false;
  editorLoading[message.id] = false;
  openCodes[message.id] = false;
};

const onEditorInput = (id: number, value: string) => {
  draftContent[id] = value;
  editorLoading[id] = true;

  clearTimeout(debounceTimers[id]);
  debounceTimers[id] = setTimeout(() => {
    isDirty[id] = value !== originalContent[id];

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
