<template>
  <v-row>
    <v-col cols="12" class="d-flex ga-4 align-center">
      <div class="font-weight-bold">Current User</div>
      <MaintainUserDialog @save="updateCurrentUser">
        <template #activator>
          <v-btn
            :disabled="props.loading"
            size="small"
            color="white"
            text="New"
            height="24"
          />
        </template>
      </MaintainUserDialog>
    </v-col>

    <v-col cols="5">
      <v-autocomplete
        :model-value="usersStore.currentUser"
        :items="users"
        :loading="props.loading"
        :disabled="props.loading"
        variant="outlined"
        item-title="name"
        item-value="id"
        autocomplete="off"
        return-object
        @update:model-value="handleChangeCurrentUser"
      />
    </v-col>

    <v-col cols="2" class="px-0 pt-5 d-flex justify-center ga-2">
      <MaintainUserDialog
        :user="usersStore.currentUser"
        @save="updateCurrentUser"
      >
        <template #activator>
          <v-btn
            :disabled="props.loading || !usersStore.currentUser"
            size="small"
            icon="mdi-pencil"
          ></v-btn>
        </template>
      </MaintainUserDialog>

      <ConfirmationDialog
        title="Confirm Deletion"
        confirmText="Are you sure you want to delete the current user?"
        :disabled="disabledDelete"
        @confirm="deleteCurrentUser"
      >
        <template #activator>
          <v-btn
            size="small"
            icon="mdi-trash-can"
            :disabled="disabledDelete"
          ></v-btn>
        </template>
      </ConfirmationDialog>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import MaintainUserDialog from "./MaintainUserDialog.vue";
import ConfirmationDialog from "@/components/common/ConfirmationDialog.vue";

const props = defineProps<{
  users: User[];
  loading: boolean;
}>();

const users = toRef(props.users);

const usersStore = useUsersStore();
const snackbarStore = useSnackbarStore();

const updateCurrentUser = (user: User) => {
  if (!users.value.find((u) => u.id === user.id)) {
    users.value.push(user);
  } else {
    const index = users.value.findIndex((u) => u.id === user.id);
    users.value[index] = user;
  }
  usersStore.setCurrentUser(user);
};

const handleChangeCurrentUser = (user: User) => {
  if (user.id === usersStore.currentUser?.id) return;

  usersStore.setCurrentUser(user);
  snackbarStore.showSnackbar("Current user updated", "info", 1500);
};

const deleteCurrentUser = async () => {
  if (!usersStore.currentUser || !usersStore.currentUser.id) return;

  const response = await usersStore.deleteUser(usersStore.currentUser.id);

  if (!response) return;

  users.value = users.value.filter((u) => u.id !== usersStore.currentUser?.id);
  const nextUser = users.value.length > 0 ? users.value[0] : null;

  if (nextUser) {
    usersStore.setCurrentUser(nextUser);
    snackbarStore.showSnackbar("User deleted successfully", "success");
    return;
  }

  usersStore.setCurrentUser(null);
};

const onlyOneUser = computed(() => users.value.length === 1);

const disabledDelete = computed(() => {
  return props.loading || !usersStore.currentUser || onlyOneUser.value;
});

watch(
  () => props.users,
  (newUsers) => {
    users.value = newUsers;
  },
);
</script>
