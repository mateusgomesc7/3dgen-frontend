<template>
  <v-navigation-drawer
    app
    :model-value="drawer"
    :permanent="!mobile"
    :temporary="mobile"
    :rail="configurationsStore.railNavigation && !mobile"
    :class="{
      'cursor-ew-resize': configurationsStore.railNavigation,
    }"
    @click="configurationsStore.setRailNavigation(false)"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-list>
      <v-list-item>
        <template v-slot:prepend>
          <v-hover>
            <template v-slot:default="{ isHovering, props }">
              <div v-bind="props">
                <v-btn
                  v-show="isHovering && configurationsStore.railNavigation"
                  variant="text"
                  class="cursor-ew-resize"
                  @click.stop="
                    configurationsStore.setRailNavigation(
                      !configurationsStore.railNavigation,
                    )
                  "
                  size="30"
                >
                  <v-icon size="25" class="rotate-90">mdi-window-closed</v-icon>
                </v-btn>
                <v-btn
                  v-show="!isHovering || !configurationsStore.railNavigation"
                  variant="text"
                  size="32"
                  @click.stop="
                    !configurationsStore.railNavigation ? openNewChat() : null
                  "
                >
                  <v-icon size="27">mdi-cube-outline</v-icon>
                </v-btn>
              </div>
            </template>
          </v-hover>
        </template>

        <template v-slot:append>
          <v-btn
            variant="text"
            class="cursor-ew-resize"
            @click.stop="clickToCloseDrawer"
            size="30"
          >
            <v-icon size="25" class="rotate-90">mdi-window-closed</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list v-model:selected="menuSelected" density="compact" nav>
      <v-list-item
        prepend-icon="mdi-square-edit-outline"
        title="New chat"
        value="new-chat"
        @click.stop="openNewChat"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-image-multiple-outline"
        title="Library"
        value="library"
        @click.stop
      ></v-list-item>
    </v-list>

    <v-divider v-if="!configurationsStore.railNavigation || mobile"></v-divider>

    <div
      v-show="!configurationsStore.railNavigation || mobile"
      ref="chatContainer"
      class="chat-list-container"
      @scroll="onScroll"
    >
      <div
        v-if="chatsStore.chats.length > 0"
        class="mx-4 mt-4 font-weight-bold"
      >
        Chats
      </div>
      <ChatList
        :selected="chatSelected"
        @open-chat="openChat"
        @rename-chat="openRenameChatDialog"
        @delete-chat="openDeleteChatDialog"
      />
    </div>

    <div class="mt-auto">
      <v-divider
        v-if="!configurationsStore.railNavigation || mobile"
      ></v-divider>
      <div class="d-flex justify-center align-center py-2 ga-2 text-center">
        <v-btn
          variant="text"
          @click.stop="configurationsStore.showConfigurationDialog = true"
        >
          <v-icon
            size="22"
            :class="{ 'mr-2': !configurationsStore.railNavigation || mobile }"
          >
            mdi-account
          </v-icon>
          {{
            !configurationsStore.railNavigation || mobile
              ? usersStores.currentUser?.name
              : ""
          }}
        </v-btn>
      </div>
    </div>

    <RenameChatDialog
      v-model="showRenameChatDialog"
      :chat="chatToRename"
      @save="renameChat"
    />

    <ConfirmationDialog
      v-model="showDeleteChatDialog"
      title="Delete Chat"
      confirmText="Are you sure you want to delete this chat?"
      @confirm="deleteChat"
    />
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import ChatList from "./ChatList.vue";
import RenameChatDialog from "./RenameChatDialog.vue";
import ConfirmationDialog from "@/components/common/ConfirmationDialog.vue";
import { useDisplay } from "vuetify";

const emits = defineEmits(["update:model-value"]);

const configurationsStore = useConfigurationsStore();
const chatsStore = useChatsStore();
const usersStores = useUsersStore();
const router = useRouter();
const snackbarStore = useSnackbarStore();
const { mobile } = useDisplay();

const chatContainer = ref(null);
const drawer = ref(true);
const showDeleteChatDialog = ref(false);
const showRenameChatDialog = ref(false);
const menuSelected = shallowRef<string[]>([]);
const chatSelected = shallowRef<string[]>([]);
const chatIdToDelete = ref<number | null>(null);
const chatToRename = ref<Chat | null>(null);
const page = ref(1);
const pageSize = 15;
const totalPages = ref(1);

const fillChatList = async (reset = false) => {
  await loadChats(reset);

  await nextTick();

  if (chatContainer.value) {
    const { scrollHeight, clientHeight } = chatContainer.value;

    if (scrollHeight <= clientHeight && page.value <= totalPages.value) {
      await fillChatList();
    }
  }
};

onMounted(async () => {
  await fillChatList(true);
});

const openChat = async (chatId: number) => {
  menuSelected.value = [];
  chatSelected.value = [`chat-${chatId}`];
  router.replace(`/chat/${chatId}`);
};

const openNewChat = async () => {
  menuSelected.value = ["new-chat"];
  chatSelected.value = [];
  router.replace("/");
};

const onScroll = async (e: Event) => {
  const target = e.target as HTMLElement;

  const scrollBottom =
    target.scrollTop + target.clientHeight >= target.scrollHeight - 20;

  if (scrollBottom) {
    await loadChats();
  }
};

const loadChats = async (reset = false) => {
  if (chatsStore.loadingPagination) return;

  if (!reset && page.value > totalPages.value) return;

  if (reset) {
    chatsStore.chats = [];
    page.value = 1;
  }

  const response = await chatsStore.getPaginatedChats({
    page: page.value,
    page_size: pageSize,
    user_id: usersStores.currentUser?.id,
  });

  totalPages.value = response.pages;
  page.value++;
};

const openRenameChatDialog = (chatId: number) => {
  chatToRename.value =
    chatsStore.chats.find((chat) => chat.id === chatId) || null;
  showRenameChatDialog.value = true;
};

const openDeleteChatDialog = (chatId: number) => {
  chatIdToDelete.value = chatId;
  showDeleteChatDialog.value = true;
};

const renameChat = async (chatManipulated: Chat) => {
  if (!chatToRename.value || !chatManipulated.name) return;

  const response = await chatsStore.renameChat(
    chatToRename.value.id,
    chatManipulated.name,
  );

  if (response) {
    snackbarStore.showSnackbar("Chat updated successfully", "success");
    showRenameChatDialog.value = false;
    chatToRename.value = null;
  }
};

const deleteChat = async () => {
  if (!chatIdToDelete.value) return;

  const isCurrentChatDeleted =
    chatsStore.currentChat?.id === chatIdToDelete.value;

  const success = await chatsStore.deleteChat(chatIdToDelete.value);

  if (success) {
    if (isCurrentChatDeleted) {
      router.replace("/");
    }
    snackbarStore.showSnackbar("Chat deleted successfully", "success");
  }

  showDeleteChatDialog.value = false;
  chatIdToDelete.value = null;
};

const clickToCloseDrawer = () => {
  if (mobile.value && drawer.value) {
    emits("update:model-value", false);
  } else {
    configurationsStore.setRailNavigation(!configurationsStore.railNavigation);
  }
};

watch(
  () => chatsStore.currentChat,
  async (newValue) => {
    if (newValue !== null) {
      menuSelected.value = [];
      chatSelected.value = [`chat-${newValue.id}`];
    } else {
      menuSelected.value = ["new-chat"];
      chatSelected.value = [];
    }
  },
  { immediate: true },
);

watch(
  () => usersStores.currentUser,
  async () => {
    await fillChatList(true);
    router.replace("/");
  },
);
</script>

<style scoped>
.v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line {
  padding-inline: 12px;
}

.cursor-ew-resize {
  cursor: ew-resize;
}

.rotate-90 {
  transform: rotate(-90deg);
}

:deep(.v-navigation-drawer__content) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-list-container {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}
</style>
