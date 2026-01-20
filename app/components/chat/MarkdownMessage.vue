<template>
  <div
    class="d-flex"
    :class="props.role === 'assistant' ? 'justify-start' : 'justify-end'"
  >
    <div
      class="bg-grey-darken-3 px-8 pt-8 pb-4 mb-4 rounded-xl markdown"
      v-html="rendered"
    />
  </div>
</template>

<script setup>
import MarkdownIt from "markdown-it";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: false,
    default: "assistant",
  },
});

const md = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
});

const normalizedText = computed(() => props.text.replace(/\\n/g, "\n"));

const rendered = computed(() => md.render(normalizedText.value));
</script>

<style scoped>
:deep(.markdown) p {
  margin-bottom: 1rem;
}

:deep(.markdown) strong {
  font-weight: bold;
}

:deep(.markdown) code {
  background: #1e1e1e;
  padding: 2px 6px;
  border-radius: 6px;
  font-family: monospace;
}

:deep(.markdown) pre {
  background: #1e1e1e;
  padding: 12px;
  border-radius: 10px;
  overflow-x: auto;
}

:deep(.markdown) pre code {
  background: none;
  padding: 0;
}
</style>
