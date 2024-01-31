<script setup lang="ts">
import { ref, computed } from "vue";
import { UseDraggable as Draggable } from "@vueuse/components";
import { useTemplateStore } from "@/stores/template";

const handle = ref<HTMLElement | null>(null);
const show = ref(true);

function toggleShow(e: KeyboardEvent) {
	if (e.ctrlKey && e.shiftKey && e.altKey && e.key.toLowerCase() === "s") {
		show.value = !show.value;
	}
}

window.addEventListener("keydown", toggleShow);

// --------------------

const template = useTemplateStore();

const templateColumnsToArr = computed(() => {
	return Object.entries(template.columns);
});

const templateRowsToArr = computed(() => {
	return Object.entries(template.rows);
});

function func() {
	console.log(template.columns);
}
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
			<div class="flex gap-3">
				<div v-for="n in 5" class="text-center">
					<p>
						{{
							templateColumnsToArr[n - 1][1] || templateColumnsToArr[n - 1][0]
						}}
					</p>
					<hr />
					<div class="group">
						<p class="group-hover:hidden">
							{{ templateRowsToArr[n - 1][0] }}
						</p>
						<p class="hidden group-hover:block">
							{{ templateRowsToArr[n - 1][1] }}
						</p>
					</div>
				</div>
			</div>

			<br />

			<button @click="func">func</button>
		</div>
	</Draggable>
</template>

<style scoped lang="postcss">
button {
	@apply rounded border-2 border-white bg-white px-3 py-1 text-black transition-colors hover:bg-black hover:text-white;
}
</style>
