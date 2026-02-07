<template>
  <div :id="`sandbox-${props.sandboxId}`" class="three-sandbox mx-auto">
    <v-btn
      icon="mdi-code-json"
      color="grey-darken-3"
      class="border-btn transparent-btn open-code-btn position-absolute"
      @click="emits('open-code')"
    >
    </v-btn>

    <v-expand-x-transition>
      <div
        v-if="props.isDirty"
        class="actions-btn position-absolute d-flex ga-2"
      >
        <v-btn
          color="grey-darken-3"
          class="transparent-btn"
          @click="emits('cancel-code')"
        >
          Cancel
        </v-btn>
        <v-btn
          color="grey-darken-3"
          class="transparent-btn"
          @click="emits('save-code')"
        >
          Save
        </v-btn>
      </div>
    </v-expand-x-transition>

    <iframe
      ref="iframeRef"
      class="sandbox-frame"
      sandbox="allow-scripts allow-same-origin allow-pointer-lock"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  sandboxId: {
    type: [String, Number],
    required: true,
  },
  isDirty: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits<{
  (e: "open-code"): void;
  (e: "cancel-code"): void;
  (e: "save-code"): void;
}>();

const iframeRef = ref<HTMLIFrameElement | null>(null);

const buildHtml = (jsCode: string, sandboxId: string | number) =>
  `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8" />
  <style>
    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      width: 100%;
      height: 100%;
    }

    #error-overlay {
      position: fixed;
      inset: 0;
      background: #1e1e1e;
      color: #ff6b6b;
      font-family: monospace;
      padding: 12px;
      white-space: pre-wrap;
      display: none;
    }
  </style>
  </head>
  <body>

  <div id="error-overlay"></div>

  <script type="module">
    const SANDBOX_ID = "${sandboxId}";

    const overlay = document.getElementById("error-overlay");

    const show = (title, content) => {
      overlay.style.display = "block";
      overlay.textContent = title + "\\n\\n" + content;
    };

    window.addEventListener("error", (event) => {
      show(
        "Runtime Error",
        event.error?.stack || event.message
      );
    });

    window.addEventListener("unhandledrejection", (event) => {
      show(
        "Unhandled Promise Rejection",
        event.reason?.stack || String(event.reason)
      );
    });

    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      originalError(...args); // mantém DevTools
      show(
        "Console Error",
        args.map(a => String(a)).join(" ")
      );
    };

    console.warn = (...args) => {
      originalWarn(...args);
      show(
        "Console Warning",
        args.map(a => String(a)).join(" ")
      );
    };

  ${jsCode}
  <\/script>

  </body>
  </html>`;

const render = () => {
  if (!iframeRef.value) return;

  iframeRef.value.srcdoc = buildHtml(props.code, props.sandboxId);
};

onMounted(() => {
  render();
});

watch(() => props.code, render);
</script>

<style scoped>
.three-sandbox {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: 12px;
  z-index: 3;
  overflow: hidden;
  border: 1px solid #333;
}

.sandbox-frame {
  width: 100%;
  height: 100%;
  border: none;
}

.open-code-btn {
  top: 8px;
  right: 8px;
}

.actions-btn {
  bottom: 8px;
  right: 8px;
}

.border-btn {
  border-radius: 8px;
}

.transparent-btn {
  opacity: 0.45;
  transition:
    opacity 0.2s ease,
    background-color 0.2s ease;
}

.transparent-btn:hover,
.transparent-btn:focus-visible {
  opacity: 1;
}
</style>
