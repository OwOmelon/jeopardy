<script setup lang="ts">
import { useModalStore } from "@/stores/modals";

const modals = useModalStore();
</script>

<template>
	<button type="button" class="fixed right-2 top-2 grid aspect-square place-items-center rounded bg-black/50 p-5 text-xl text-white transition-transform hover:scale-110"
		@click="modals.mainMenu = !modals.mainMenu"
	>
		<span class="absolute">||</span>
	</button>
</template>
