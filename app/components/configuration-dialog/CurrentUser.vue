<template>
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
</template>

<script setup lang="ts">
const users = ref(["Mateus", "João", "Maria", "Ana"]);

const user = ref(users.value[0]);
</script>
