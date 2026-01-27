import { userApi } from "./user.api";

export const useUsersStore = defineStore("users", () => {
  const currentUser = ref<User | null>(
    localStorage.getItem("3dgen_currentUser")
      ? JSON.parse(localStorage.getItem("3dgen_currentUser") as string)
      : null,
  );

  const setCurrentUser = (user: User | null) => {
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

  const createUser = async (userData: UserPayload): Promise<User | null> => {
    try {
      const newUser = await userApi.create(userData);
      return newUser;
    } catch (error) {
      console.error("Failed to create user:", error);
      return null;
    }
  };

  const updateUser = async (userData: User): Promise<User | null> => {
    if (!userData.id) {
      console.error("User ID is required for update.");
      return null;
    }

    try {
      const updatedUser = await userApi.update(userData.id, userData);
      return updatedUser;
    } catch (error) {
      console.error("Failed to update user:", error);
      return null;
    }
  };

  const deleteUser = async (userId: number): Promise<boolean> => {
    try {
      await userApi.delete(userId);
      return true;
    } catch (error) {
      console.error("Failed to delete user:", error);
      return false;
    }
  };

  return {
    currentUser,
    getAllUsers,
    setCurrentUser,
    createUser,
    updateUser,
    deleteUser,
  };
});
