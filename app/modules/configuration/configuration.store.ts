export const useConfigurationsStore = defineStore("configurations", () => {
  const railNavigation = ref(localStorage.getItem("railNavigation") === "true");

  const setRailNavigation = (value: boolean) => {
    railNavigation.value = value;
    localStorage.setItem("railNavigation", value.toString());
  };

  return {
    railNavigation,
    setRailNavigation,
  };
});
