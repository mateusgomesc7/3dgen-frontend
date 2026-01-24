<template>
  <div :id="`sandbox-${props.sandboxId}`" class="three-sandbox mx-auto">
    <v-btn
      icon="mdi-code-json"
      color="grey-darken-3"
      class="sandbox-btn"
      @click="emits('open-code')"
    >
    </v-btn>

    <iframe
      ref="iframeRef"
      class="sandbox-frame"
      sandbox="allow-scripts allow-same-origin"
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
});

const emits = defineEmits<{ (e: "open-code"): void }>();

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
  width: 776px;
  height: 500px;
  border-radius: 12px;
  z-index: 3;
  overflow: hidden;
  border: 1px solid #333;
}

.sandbox-frame {
  width: 100%;
  height: 100%;
  min-width: 488px;
  border: none;
}

.sandbox-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 5;
  border-radius: 8px;

  opacity: 0.45;
  transition:
    opacity 0.2s ease,
    background-color 0.2s ease;
}

.sandbox-btn:hover,
.sandbox-btn:focus-visible {
  opacity: 1;
}
</style>
