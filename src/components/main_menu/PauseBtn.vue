<script setup lang="ts">
import { useMainMenuStore } from "@/stores/mainmenu";

import IconPause from "~icons/solar/pause-bold";

const mainmenu = useMainMenuStore();
</script>

<template>
	<button
		type="button"
		class="shadow-subtle fixed right-2 top-2 grid aspect-square place-items-center rounded bg-red-400 p-3 text-xl text-white transition-[background-color,_color,_transform] hover:scale-110"
		@click="mainmenu.show = !mainmenu.show"
	>
		<IconPause />
	</button>
</template>
