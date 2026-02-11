<template>
  <v-row>
    <v-col cols="12" class="d-flex ga-4 align-center">
      <div class="font-weight-bold">
        {{ $t("components.configuration_dialog.current_user.label") }}
      </div>
      <MaintainUserDialog @save="updateCurrentUser">
        <template #activator>
          <v-btn
            :disabled="props.loading"
            :text="
              $t('components.configuration_dialog.current_user.add_user_btn')
            "
            size="small"
            color="white"
            height="24"
          />
        </template>
      </MaintainUserDialog>
    </v-col>

    <v-col cols="10" md="5">
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

    <v-col
      cols="2"
      class="px-0 pt-0 pt-sm-0 pt-md-5 mt-n2 mt-sm-n2 mt-md-0 d-flex justify-center ga-2 flex-column flex-sm-column flex-md-row"
    >
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
        :title="
          $t('components.configuration_dialog.current_user.title_delete_user')
        "
        :confirm-text="
          $t(
            'components.configuration_dialog.current_user.confirm_text_delete_user',
          )
        "
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
const { t } = useI18n();

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
  snackbarStore.showSnackbar(
    t(
      "components.configuration_dialog.current_user.messages.user_updated_success",
    ),
    "info",
    1500,
  );
};

const deleteCurrentUser = async () => {
  if (!usersStore.currentUser || !usersStore.currentUser.id) return;

  const response = await usersStore.deleteUser(usersStore.currentUser.id);

  if (!response) return;

  users.value = users.value.filter((u) => u.id !== usersStore.currentUser?.id);
  const nextUser = users.value.length > 0 ? users.value[0] : null;

  if (nextUser) {
    usersStore.setCurrentUser(nextUser);
    snackbarStore.showSnackbar(
      t(
        "components.configuration_dialog.current_user.messages.user_deleted_success",
      ),
      "success",
    );
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
