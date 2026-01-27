<template>
  <v-dialog v-model="show" max-width="450" persistent>
    <template v-slot:activator="{ props: activatorProps }">
      <div v-bind="activatorProps">
        <slot name="activator"></slot>
      </div>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-h5 px-2">
            {{ editMode ? "Edit User" : "Create User" }}
          </div>
        </v-card-title>

        <v-card-text class="pb-1">
          <v-form ref="form" v-model="valid" @submit.prevent="save">
            <v-text-field
              label="Name"
              v-model="userManipulated.name"
              variant="outlined"
              required
              :rules="[(v) => !!v || 'Name is required']"
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
    }
  } else {
    const response = await usersStore.createUser(userManipulated.value);
    if (response) {
      emits("save", response);
      show.value = false;
    }
  }
};

const editMode = computed(() => !!props.user);

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

const disabledSave = computed(() => {
  return (
    !valid.value ||
    (editMode.value && userManipulated.value?.name === props.user?.name)
  );
});
</script>
