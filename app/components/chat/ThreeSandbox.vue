<template>
  <div class="three-sandbox">
    <iframe
      ref="iframeRef"
      class="sandbox-frame"
      sandbox="allow-scripts allow-same-origin"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
});

const iframeRef = ref(null);

const buildHtml = (jsCode) =>
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
    </style>
    </head>
    <body>
        <script type="module">
        ${jsCode}
        <\/script>
    </body>
    </html>`;

const render = () => {
  if (!iframeRef.value) return;

  iframeRef.value.srcdoc = buildHtml(props.code);
};

watch(() => props.code, render);

onMounted(render);
</script>

<style scoped>
.three-sandbox {
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #333;
}

.sandbox-frame {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
