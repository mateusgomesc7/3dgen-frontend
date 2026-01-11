<template>
  <v-navigation-drawer
    app
    v-model="drawer"
    :rail="rail"
    :class="{ 'cursor-ew-resize': rail }"
    permanent
    @click="rail = false"
  >
    <v-list>
      <v-list-item>
        <template v-slot:prepend>
          <v-hover>
            <template v-slot:default="{ isHovering, props }">
              <div v-bind="props">
                <v-btn
                  v-show="isHovering && rail"
                  variant="text"
                  class="cursor-ew-resize"
                  @click.stop="rail = !rail"
                  size="30"
                >
                  <v-icon size="25" class="rotate-90">mdi-window-closed</v-icon>
                </v-btn>
                <v-btn v-show="!isHovering || !rail" variant="text" size="32">
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
            @click.stop="rail = !rail"
            size="30"
          >
            <v-icon size="25" class="rotate-90">mdi-window-closed</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-square-edit-outline"
        title="New chat"
        value="new-chat"
        @click.stop
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-image-multiple-outline"
        title="Library"
        value="library"
        @click.stop
      ></v-list-item>
    </v-list>

    <v-divider v-if="!rail"></v-divider>

    <div v-if="!rail">
      <div class="mx-4 mt-4 font-weight-bold">Chats</div>
      <v-list density="compact" nav>
        <v-list-item
          v-for="n in chatsStore.chats.length"
          :key="n"
          :title="`Chat ${n}`"
          :value="`chat-${n}`"
          @click.stop
        ></v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const chatsStore = useChatsStore();

const drawer = ref(true);
const rail = ref(true);

watch(
  () => rail.value,
  async (newValue) => {
    if (!newValue) await chatsStore.getAllChats();
  },
  { immediate: true }
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
