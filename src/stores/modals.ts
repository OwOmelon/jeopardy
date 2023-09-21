import { ref, computed, onBeforeMount } from "vue";
import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", () => {
  const mainMenu = ref(true);
  const disableMainMenuToggle = ref<boolean>(false);

  function toggleMainMenu(e: KeyboardEvent): void {
    if (disableMainMenuToggle.value) return;

    if (e.code === "Escape") {
      mainMenu.value = !mainMenu.value;
    }
  }

  onBeforeMount(() => {
    window.addEventListener("keydown", toggleMainMenu);
  });

  return { mainMenu, disableMainMenuToggle };
});
