<template>
  <div
    class="d-flex position-relative"
    :class="role === 'assistant' ? 'justify-start' : 'justify-end'"
  >
    <v-textarea
      v-model="localValue"
      auto-grow
      variant="solo"
      bg-color="grey-darken-3"
      rounded="lg"
      hide-details
      min-width="800"
      :loading="props.loading"
      @update:model-value="emitUpdate"
    />

    <div class="position-absolute editor-loading">
      <v-progress-circular
        v-show="props.loading"
        color="white"
        :size="22"
        indeterminate
      ></v-progress-circular>
      <v-icon v-show="!props.loading" icon="mdi-checkbox-marked-circle">
      </v-icon>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "assistant",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const localValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    if (val !== localValue.value) {
      localValue.value = val;
    }
  },
);

function emitUpdate(value) {
  emit("update:modelValue", value);
}
</script>

<style scoped>
.editor-loading {
  right: 8px;
  top: 12px;
  pointer-events: none;
}
</style>
