<script setup lang="ts">
import { useMainMenuStore } from "@/stores/mainmenu";

const mainmenu = useMainMenuStore();
</script>

<template>
	<button type="button" class="fixed right-2 top-2 grid aspect-square place-items-center rounded bg-black/50 p-5 text-xl text-white transition-transform hover:scale-110"
		@click="mainmenu.show = !mainmenu.show"
	>
		<span class="absolute">||</span>
	</button>
</template>
