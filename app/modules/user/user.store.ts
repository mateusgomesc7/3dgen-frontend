import { userApi } from "./user.api";

export const useUsersStore = defineStore("users", () => {
  const currentUser = ref<User | null>(
    localStorage.getItem("3dgen_currentUser")
      ? JSON.parse(localStorage.getItem("3dgen_currentUser") as string)
      : null,
  );

  const setCurrentUser = (user: User) => {
    currentUser.value = user;
    localStorage.setItem("3dgen_currentUser", JSON.stringify(user));
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
    setCurrentUser,
  };
});
