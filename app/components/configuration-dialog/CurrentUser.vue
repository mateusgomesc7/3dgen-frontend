<template>
  <v-row>
    <v-col cols="12" class="d-flex ga-4 align-center">
      <div>Current User</div>
      <v-btn :disabled="props.loading" size="small" color="white" text="New" />
    </v-col>

    <v-col cols="10">
      <v-autocomplete
        v-model="user"
        :items="props.users"
        :loading="props.loading"
        :disabled="props.loading"
        variant="outlined"
        item-title="name"
        item-value="id"
        return-object
      />
    </v-col>

    <v-col cols="2" class="px-0 pt-5 d-flex justify-center ga-1">
      <v-btn :disabled="props.loading" size="small" icon="mdi-pencil"></v-btn>
      <v-btn :disabled="props.loading" size="small" icon="mdi-close"></v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps<{
  users: User[];
  loading: boolean;
}>();

const user = ref<User>();
</script>
