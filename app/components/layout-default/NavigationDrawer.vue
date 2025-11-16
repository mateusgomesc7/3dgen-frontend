<template>
  <v-navigation-drawer
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
                  <img
                    src="@/assets/icons/navigation-opener.svg"
                    alt="Expand"
                    style="width: 18px; height: 18px"
                  />
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
            <img
              src="@/assets/icons/navigation-opener.svg"
              alt="Expand"
              style="width: 18px; height: 18px"
            />
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
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from "vue";

const drawer = ref(true);
const rail = ref(true);
</script>

<style scoped>
.v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line {
  padding-inline: 12px;
}

.cursor-ew-resize {
  cursor: ew-resize;
}
</style>
