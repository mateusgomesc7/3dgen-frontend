import { useSnackbarStore } from "@/modules/snackbar/snakcbar.store";

export const api = $fetch.create({
  baseURL: useRuntimeConfig().public.apiBaseUrl,
  credentials: "include",

  onRequest({ options }) {
    options.headers = {
      ...options.headers,
    };
  },

  async onResponseError({ response }) {
    const snackbarStore = useSnackbarStore();

    const errorMessage =
      response._data?.error.detail || "An unexpected error occurred.";
    const errorStatus = response.status;

    switch (errorStatus) {
      case 500:
        snackbarStore.showSnackbar(
          "Server error. Please try again later.",
          "error",
        );
        break;
      default:
        snackbarStore.showSnackbar(errorMessage, "error");
        break;
    }
  },
});
