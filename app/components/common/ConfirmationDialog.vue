<template>
  <v-dialog v-model="show" max-width="450" persistent>
    <template v-slot:activator="{ props: activatorProps }">
      <div
        v-bind="disabled ? {} : activatorProps"
        style="display: inline-flex; width: fit-content; height: fit-content"
      >
        <slot name="activator"></slot>
      </div>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-h5 px-2">
            {{ title }}
          </div>
        </v-card-title>

        <v-card-text class="pb-5">
          <div class="text-subtitle-1">
            {{
              confirmText ||
              $t("components.common.confirmation_dialog.confirm_text")
            }}
          </div>
        </v-card-text>

        <v-card-actions class="d-flex justify-end px-6 pb-4">
          <v-btn text @click="isActive.value = false">
            {{ $t("utils.cancel_btn") }}
          </v-btn>
          <v-btn
            color="white"
            variant="flat"
            :text="$t('utils.confirm_btn')"
            @click="handleConfirmClick"
          >
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  confirmText?: string;
  disabled?: boolean;
}>();

const emits = defineEmits<{
  (e: "confirm"): void;
}>();

const show = ref(false);

const handleConfirmClick = () => {
  emits("confirm");
  show.value = false;
};
</script>
