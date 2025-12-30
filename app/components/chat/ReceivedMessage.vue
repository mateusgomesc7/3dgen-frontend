<template>
  <div class="d-flex justify-start">
    <div class="bg-grey-darken-3 pa-4 mb-4 rounded-xl">
      {{ props.text }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>
