import { userApi } from "./user.api";

export const useUsersStore = defineStore("users", () => {
  const currentUser = ref<User | null>(null);

  // Mock
  currentUser.value = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const getAllUsers = async (): Promise<User[]> => {
    try {
      return await userApi.getAll();
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return [];
    }
  };

  return {
    currentUser,
    getAllUsers,
  };
});
