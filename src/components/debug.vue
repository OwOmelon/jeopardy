<script setup lang="ts">
import { ref, computed, onBeforeMount } from "vue";
import { useTemplateStore } from "../stores/template";
import { useDraggable } from "@vueuse/core";
import { numToPerc, getElBoundingClientRect } from "../stores/composables";

const template = useTemplateStore();

const el = ref<HTMLElement | null>(null);
const { x, y, style } = useDraggable(el, {
	initialValue: { x: window.innerWidth / 10, y: window.innerWidth / 10 },
});

const elStyleToPerc = computed(() => {
	return {
		top: `${numToPerc(y.value, window.innerHeight).toFixed(2)}%`,
		left: `${numToPerc(x.value, window.innerWidth).toFixed(2)}%`,
	};
});

// ---------------

const show = ref(true);

function toggleShow(e: KeyboardEvent): void {
	const condition = e.altKey && e.ctrlKey && e.shiftKey;

	if (!condition) return;

	switch (e.key) {
		case "S":
			show.value = !show.value;
			break;
	}
}

onBeforeMount(() => {
	window.addEventListener("keydown", toggleShow);
});

// ---------------

const stuff = computed(() => {
	return {
		activeCellIndeces: template.activeCellIndeces,
		activeCellData: template.activeCellData,
	};
});

// ---------------

function func() {
	const a = JSON.parse("");

	console.log(a ?? null);
}
</script>

<template>
	<div
		v-if="show"
		ref="el"
		:style="elStyleToPerc"
		class="fixed grid place-items-center"
	>
		<div
			class="absolute min-w-[400px] rounded border-[1px] border-white bg-black/50 p-3 text-xs text-white backdrop-blur-sm"
		>
			<p class="text-center font-bold">
				{{ template.name || "template name" }}, editing: {{ template.editing }}
			</p>

			<br />

			<!-- --- -->

			<div class="relative grid grid-cols-5 grid-rows-2 text-center">
				<template v-for="category in template.columns">
					<div class="row-start-1 grid items-end">
						<p>{{ category.id }}</p>
					</div>

					<div class="row-start-2 grid items-start">
						<p>{{ category.name || "x" }}</p>
					</div>
				</template>

				<hr
					class="absolute left-0 top-1/2 w-full -translate-y-1/2 border-white"
				/>
			</div>

			<br />

			<div class="relative grid grid-cols-5 grid-rows-2 text-center">
				<template v-for="n in 5">
					<div class="row-start-1 grid place-items-center">
						<p>{{ template.rows[n - 1] }}</p>
					</div>

					<div class="row-start-2 grid place-items-center">
						<p>{{ template.points[n - 1] }}</p>
					</div>
				</template>

				<hr
					class="absolute left-0 top-1/2 w-full -translate-y-1/2 border-white"
				/>
			</div>

			<br />

			<!-- --- -->

			<template v-for="(value, key, index) in stuff">
				<template v-if="value">
					<div v-if="typeof value === 'object'" class="flex flex-col">
						<span>{{ key }}: {</span>
						<div class="ml-3">
							<p v-for="(objvalue, objkey, objindex) in value">
								{{ objkey }}: {{ objvalue }}
							</p>
						</div>
						<span>}</span>
					</div>

					<p v-else>{{ key }}: {{ value }}</p>
				</template>
			</template>

			<br />

			<button type="button" @click="func">func</button>

			<!-- --- -->

			<!-- <button
				type="button"
				class="absolute right-2 top-2 rounded-full bg-white p-2 transition-transform hover:scale-125"
				@click="show = false"
			/> -->
		</div>
	</div>
</template>

<style scoped lang="postcss">
button {
	@apply block rounded bg-white px-2 py-1 text-black transition-colors hover:bg-transparent hover:text-white;
}
</style>
