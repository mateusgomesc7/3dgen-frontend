<template>
  <v-list v-model:selected="internalSelected" density="compact" nav>
    <v-list-item
      v-for="chat in chatsStore.chats"
      :key="chat.id"
      :title="
        chat.name ??
        $t(
          'components.layout_default.navigation_drawer.chat_list.name_default',
          { chatId: chat.id },
        )
      "
      :value="`chat-${chat.id}`"
      @click.stop="emits('open-chat', chat.id)"
    >
      <template v-slot:append>
        <v-btn
          variant="text"
          size="30"
          icon
          @click.stop="openMenu($event, chat.id)"
        >
          <v-icon size="18">mdi-dots-horizontal</v-icon>
        </v-btn>
      </template>
    </v-list-item>
  </v-list>

  <v-menu
    v-model="showMenu"
    :target="menuTarget"
    location="end"
    :offset="[5, -10]"
  >
    <v-list density="compact">
      <v-list-item @click="renameChat">
        <v-list-item-title>
          {{
            $t(
              "components.layout_default.navigation_drawer.chat_list.rename_menu",
            )
          }}
        </v-list-item-title>
        <template v-slot:prepend>
          <v-icon size="18">mdi-pencil</v-icon>
        </template>
      </v-list-item>

      <v-list-item @click="deleteChat">
        <v-list-item-title class="text-red">
          {{
            $t(
              "components.layout_default.navigation_drawer.chat_list.delete_menu",
            )
          }}
        </v-list-item-title>
        <template v-slot:prepend>
          <v-icon size="18" class="text-red">mdi-delete</v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
const componentProps = defineProps<{
  selected: string[] | null;
}>();

const emits = defineEmits<{
  (e: "open-chat", chatId: number): void;
  (e: "update:selected", value: string[]): void;
  (e: "rename-chat", chatId: number): void;
  (e: "delete-chat", chatId: number): void;
}>();

const chatsStore = useChatsStore();

const showMenu = ref(false);
const menuTarget = ref<Element | undefined>(undefined);
const menuChatId = ref<number | null>(null);

function openMenu(event: MouseEvent, chatId: number) {
  menuTarget.value = event.currentTarget as Element;
  menuChatId.value = chatId;
  showMenu.value = true;
}

function renameChat() {
  if (!menuChatId.value) return;
  emits("rename-chat", menuChatId.value);
  showMenu.value = false;
}

function deleteChat() {
  if (!menuChatId.value) return;
  emits("delete-chat", menuChatId.value);
  showMenu.value = false;
}

const internalSelected = computed({
  get: () => componentProps.selected ?? [],
  set: (value) => emits("update:selected", value),
});
</script>

<style scoped lang="scss">
:deep(.v-list-item__spacer) {
  width: 16px !important;
}

:deep(.v-list-item .v-list-item__append) {
  opacity: 0;
}

:deep(.v-list-item:hover .v-list-item__append) {
  opacity: 1;
}
</style>
