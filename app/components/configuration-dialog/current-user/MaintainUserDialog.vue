<template>
  <v-dialog v-model="show" max-width="450" persistent>
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
            {{
              editMode
                ? $t(
                    "components.configuration_dialog.current_user.maintain_user_dialog.title_edit",
                  )
                : $t(
                    "components.configuration_dialog.current_user.maintain_user_dialog.title_create",
                  )
            }}
          </div>
        </v-card-title>

        <v-card-text class="pb-1">
          <v-form ref="form" v-model="valid" @submit.prevent="save">
            <v-text-field
              :label="
                $t(
                  'components.configuration_dialog.current_user.maintain_user_dialog.name_label',
                )
              "
              v-model="userManipulated.name"
              variant="outlined"
              autocomplete="off"
              required
              :rules="[(v) => !!v || $t('utils.rules.required')]"
            />
          </v-form>
        </v-card-text>

        <v-card-actions class="d-flex justify-end px-6 pb-4">
          <v-btn text @click="isActive.value = false">
            {{ $t("utils.cancel_btn") }}
          </v-btn>
          <v-btn
            color="white"
            variant="flat"
            :text="$t('utils.save_btn')"
            :disabled="disabledSave"
            @click="save"
          >
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  user?: User | null;
}>();

const emits = defineEmits<{
  (e: "save", user: User): void;
}>();

const usersStore = useUsersStore();
const snackbarStore = useSnackbarStore();
const { t } = useI18n();

const show = ref(false);
const valid = ref<boolean>(false);
const userManipulated = ref<User>({
  name: "",
});

const save = async () => {
  if (disabledSave.value) return;

  if (userManipulated.value.id) {
    const response = await usersStore.updateUser(userManipulated.value);
    if (response) {
      emits("save", response);
      show.value = false;
      snackbarStore.showSnackbar(
        t(
          "components.configuration_dialog.current_user.maintain_user_dialog.messages.user_updated_success",
        ),
        "success",
      );
    }
  } else {
    const response = await usersStore.createUser(userManipulated.value);
    if (response) {
      emits("save", response);
      show.value = false;
      snackbarStore.showSnackbar(
        t(
          "components.configuration_dialog.current_user.maintain_user_dialog.messages.user_created_success",
        ),
        "success",
      );
    }
  }
};

const editMode = computed(() => !!props.user);

const disabledSave = computed(() => {
  return (
    !valid.value ||
    (editMode.value && userManipulated.value?.name === props.user?.name)
  );
});

watch(
  () => show.value,
  () => {
    if (!show.value) return;

    if (props.user) {
      userManipulated.value = { ...props.user };
    } else {
      userManipulated.value = {
        name: "",
      };
    }
  },
  { immediate: true },
);
</script>
