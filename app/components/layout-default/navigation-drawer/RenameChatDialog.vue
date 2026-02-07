<template>
  <v-dialog v-model="show" max-width="600" persistent>
    <template v-slot:activator="{ props: activatorProps }">
      <div
        v-bind="activatorProps"
        style="display: inline-flex; width: fit-content; height: fit-content"
      >
        <slot name="activator"></slot>
      </div>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-h5 px-2">
            {{ "Rename Chat" }}
          </div>
        </v-card-title>

        <v-card-text class="pb-1">
          <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="emits('save', chatManipulated)"
          >
            <v-text-field
              label="Name"
              v-model="chatManipulated.name"
              variant="outlined"
              autocomplete="off"
              required
              :rules="[
                (v) => !!v || 'Name is required',
                (v) =>
                  (v && v.length <= 100) ||
                  'Name must be less than 100 characters',
              ]"
              hint="Max 100 characters"
              persistent-hint
            />
          </v-form>
        </v-card-text>

        <v-card-actions class="d-flex justify-end px-6 pb-4">
          <v-btn text @click="isActive.value = false"> Cancel </v-btn>
          <v-btn
            color="white"
            text="Save"
            variant="flat"
            :disabled="disabledSave"
            @click="emits('save', chatManipulated)"
          >
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  chat: Chat | null;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "save", chat: Chat): void;
}>();

const valid = ref<boolean>(false);
const chatManipulated = ref<Chat>({ id: 0, user_id: 0, name: "" });

const show = computed({
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value),
});

watch(
  () => show.value,
  () => {
    if (!show.value) return;
    if (!props.chat) return;

    chatManipulated.value = { ...props.chat };
  },
  { immediate: true },
);

const disabledSave = computed(() => {
  return !valid.value || chatManipulated.value?.name === props.chat?.name;
});
</script>
