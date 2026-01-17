export const useUsersStore = defineStore("users", () => {
  const currentUser = ref<User | null>(null);

  // Mock
  currentUser.value = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return {
    currentUser,
  };
});
