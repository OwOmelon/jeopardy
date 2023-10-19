import { ref, computed, onBeforeMount } from "vue";
import { defineStore } from "pinia";

export const useMainMenuStore = defineStore("mainmenu", () => {
  const show = ref(true);
  const disableToggle = ref<boolean>(false);

  function toggleShow(e: KeyboardEvent): void {
    if (e.code === "Escape" && !disableToggle.value) {
      show.value = !show.value;
    }
  }

  onBeforeMount(() => {
    window.addEventListener("keydown", toggleShow);
  });

  return { show, disableToggle };
});
