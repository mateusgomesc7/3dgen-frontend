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
          />
        </template>
      </MaintainUserDialog>
    </v-col>

    <v-col cols="10">
      <v-autocomplete
        :model-value="usersStore.currentUser"
        :items="users"
        :loading="props.loading"
        :disabled="props.loading"
        variant="outlined"
        item-title="name"
        item-value="id"
        return-object
        @update:model-value="(val) => usersStore.setCurrentUser(val)"
      />
    </v-col>

    <v-col cols="2" class="px-0 pt-5 d-flex justify-center ga-1">
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
      <v-btn
        :disabled="props.loading || !usersStore.currentUser"
        size="small"
        icon="mdi-trash-can"
      ></v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import MaintainUserDialog from "./MaintainUserDialog.vue";

const props = defineProps<{
  users: User[];
  loading: boolean;
}>();

const users = toRef(props.users);

const usersStore = useUsersStore();

const updateCurrentUser = (user: User) => {
  if (!users.value.find((u) => u.id === user.id)) {
    users.value.push(user);
  } else {
    const index = users.value.findIndex((u) => u.id === user.id);
    users.value[index] = user;
  }
  usersStore.setCurrentUser(user);
};

watch(
  () => props.users,
  (newUsers) => {
    users.value = newUsers;
  },
);
</script>
