export const useConfigurationsStore = defineStore("configurations", () => {
  const railNavigation = ref(
    localStorage.getItem("3dgen_railNavigation") === "true",
  );

  const setRailNavigation = (value: boolean) => {
    railNavigation.value = value;
    localStorage.setItem("3dgen_railNavigation", value.toString());
  };

  return {
    railNavigation,
    setRailNavigation,
  };
});
