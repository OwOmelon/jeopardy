<script setup lang="ts">
import { ref } from "vue";
import { UseDraggable as Draggable } from "@vueuse/components";

const handle = ref<HTMLElement | null>(null);
const show = ref(true);

function toggleShow(e: KeyboardEvent) {
	if (e.ctrlKey && e.shiftKey && e.altKey && e.key.toLowerCase() === "s") {
		show.value = !show.value;
	}
}

window.addEventListener("keydown", toggleShow);
</script>

<template>
	<Draggable
		v-if="show"
		:handle="handle"
		:initial-value="{ x: 50, y: 50 }"
		class="fixed"
	>
		<div
			ref="handle"
			class="flex items-center justify-end rounded-t bg-white p-1"
		>
			<button class="rounded-full bg-black p-2" @click="show = false" />
		</div>

		<div
			id="DEBUG-MAIN"
			class="rounded-b bg-black/50 p-3 text-xs text-white backdrop-blur-sm"
		>
			<p>man what in the goddamn</p>
			<p>i shouldn't have ignored the debug component</p>
			<p>i'm so fucking stupid</p>
		</div>
	</Draggable>
</template>
