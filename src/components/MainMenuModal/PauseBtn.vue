<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";
import { useMainMenuStore } from "@/stores/mainmenu";

import IconPause from "~icons/solar/pause-bold";

const template = useTemplateStore();
const mainmenu = useMainMenuStore();
</script>

<template>
	<button
		type="button"
		:class="[
			template.editing
				? 'bg-red-400 text-white'
				: 'bg-stone-500 text-stone-300',
			'fixed right-2 top-2 grid aspect-square place-items-center rounded p-3 text-xl transition-[background-color,_color,_transform] hover:scale-110',
		]"
		@click="mainmenu.show = !mainmenu.show"
	>
		<IconPause />
	</button>
</template>
