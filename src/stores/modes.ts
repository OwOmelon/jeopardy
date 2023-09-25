import { ref, computed, watch, watchEffect, onBeforeMount } from "vue";
import { defineStore } from "pinia";

export type Modes = "edit" | "play";

export const useModesStore = defineStore("modes", () => {
	const current = ref<Modes>("edit");

	return { current };
});
