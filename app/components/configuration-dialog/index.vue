<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" icon="mdi-cog"></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-h5 px-2">Configurations</div>

          <v-btn
            icon="mdi-close"
            variant="text"
            @click="isActive.value = false"
          ></v-btn>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" class="d-flex ga-4 align-center">
              <div>Current Model</div>
              <v-btn
                append-icon="mdi-open-in-new"
                size="small"
                color="white"
                text="New"
              ></v-btn>
            </v-col>

            <v-col cols="11">
              <v-autocomplete
                v-model="model"
                :items="models"
                variant="outlined"
              ></v-autocomplete>
            </v-col>

            <v-col cols="1" class="px-0 pt-4 d-flex justify-center">
              <v-btn size="small" icon="mdi-close"></v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="d-flex ga-4 align-center">
              <div>Current User</div>
              <v-btn size="small" color="white" text="New"></v-btn>
            </v-col>

            <v-col cols="10">
              <v-autocomplete
                v-model="user"
                :items="users"
                variant="outlined"
              ></v-autocomplete>
            </v-col>

            <v-col cols="2" class="px-0 pt-4 d-flex justify-center">
              <v-btn size="small" icon="mdi-pencil"></v-btn>
              <v-btn size="small" icon="mdi-close"></v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
const models = ref([
  "gemma3:latest",
  "gemma3:fast",
  "gemma2:latest",
  "gemma2:fast",
  "stable-diffusion:latest",
  "stable-diffusion:fast",
]);
const users = ref(["Mateus", "João", "Maria", "Ana"]);

const model = ref(models.value[0]);
const user = ref(users.value[0]);
</script>
