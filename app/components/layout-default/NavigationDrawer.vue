<template>
  <v-navigation-drawer
    app
    v-model="drawer"
    permanent
    :rail="configurationsStore.railNavigation"
    :class="{ 'cursor-ew-resize': configurationsStore.railNavigation }"
    @click="configurationsStore.setRailNavigation(false)"
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
            @click.stop="
              configurationsStore.setRailNavigation(
                !configurationsStore.railNavigation,
              )
            "
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

    <v-divider v-if="!configurationsStore.railNavigation"></v-divider>

    <div
      v-show="!configurationsStore.railNavigation"
      ref="chatContainer"
      class="chat-list-container"
      @scroll="onScroll"
    >
      <div class="mx-4 mt-4 font-weight-bold">Chats</div>
      <v-list v-model:selected="chatSelected" density="compact" nav>
        <v-list-item
          v-for="chat in chatsStore.chats"
          :key="chat.id"
          :title="chat.name ?? `Chat ${chat.id}`"
          :value="`chat-${chat.id}`"
          @click.stop="openChat(chat.id)"
        ></v-list-item>
      </v-list>
    </div>

    <div class="mt-auto">
      <v-divider v-if="!configurationsStore.railNavigation"></v-divider>
      <div class="d-flex justify-center align-center py-2 ga-2 text-center">
        <v-btn
          variant="text"
          @click.stop="configurationsStore.showConfigurationDialog = true"
        >
          <v-icon
            size="22"
            :class="{ 'mr-2': !configurationsStore.railNavigation }"
          >
            mdi-account
          </v-icon>
          {{
            !configurationsStore.railNavigation
              ? usersStores.currentUser?.name
              : ""
          }}
        </v-btn>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const configurationsStore = useConfigurationsStore();
const chatsStore = useChatsStore();
const usersStores = useUsersStore();
const router = useRouter();

const chatContainer = ref(null);
const drawer = ref(true);
const menuSelected = shallowRef<string[]>([]);
const chatSelected = shallowRef<string[]>([]);
const page = ref(1);
const pageSize = 15;
const totalPages = ref(1);

const fillChatList = async () => {
  await loadChats();

  await nextTick();

  if (chatContainer.value) {
    const { scrollHeight, clientHeight } = chatContainer.value;

    if (scrollHeight <= clientHeight && page.value <= totalPages.value) {
      await fillChatList();
    }
  }
};

onMounted(async () => {
  await fillChatList();
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
  });

  totalPages.value = response.pages;
  page.value++;
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
