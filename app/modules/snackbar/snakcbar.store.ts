export const useSnackbarStore = defineStore("snackbar", () => {
  const snackbar = ref({
    show: false,
    message: "",
    color: "info" as "success" | "error" | "info" | "warning",
    timeout: 3000,
  });

  const showSnackbar = (
    message: string,
    color: "success" | "error" | "info" | "warning",
    timeout = 3000,
  ) => {
    snackbar.value = { show: true, message, color, timeout };
  };

  const hideSnackbar = () => {
    snackbar.value.show = false;
  };

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
  };
});
