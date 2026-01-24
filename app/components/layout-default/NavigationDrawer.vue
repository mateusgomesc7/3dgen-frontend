<template>
  <v-navigation-drawer
    app
    v-model="drawer"
    :rail="configurationsStore.railNavigation"
    :class="{ 'cursor-ew-resize': configurationsStore.railNavigation }"
    permanent
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

    <div v-if="!configurationsStore.railNavigation">
      <div class="mx-4 mt-4 font-weight-bold">Chats</div>
      <v-list v-model:selected="chatSelected" density="compact" nav>
        <v-list-item
          v-for="chat in chatsStore.chats"
          :key="chat.id"
          :title="`Chat ${chat.id}`"
          :value="`chat-${chat.id}`"
          @click.stop="openChat(chat.id)"
        ></v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const configurationsStore = useConfigurationsStore();
const chatsStore = useChatsStore();
const router = useRouter();

const drawer = ref(true);

const menuSelected = shallowRef<string[]>([]);
const chatSelected = shallowRef<string[]>([]);

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

watch(
  () => configurationsStore.railNavigation,
  async (newValue) => {
    if (!newValue) await chatsStore.getAllChats();
  },
  { immediate: true },
);

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
</style>
