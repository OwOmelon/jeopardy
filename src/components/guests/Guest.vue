<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Guest } from "@/stores/guests";

import IconPlus from "~icons/ion/plus-round";
import IconMinus from "~icons/ion/minus-round";

const props = defineProps<Guest>();

const emit = defineEmits<{
	"edit-points": [Guest["points"]["illegitimate"]];
}>();

const totalPoints = computed<number>(() => {
	return props.points.legitimate + props.points.illegitimate;
});

const textBox = ref<HTMLInputElement | null>(null);
const textInput = ref<number>(totalPoints.value);

function textBoxEditPoints(): void {
	if (!textInput.value.toString().length) {
		textInput.value = totalPoints.value;
		return;
	}

	emit("edit-points", textInput.value - props.points.legitimate);
}

function btnEditPoints(operation: "add" | "subtract"): void {
	const operand =
		operation === "add" ? 100 : operation === "subtract" ? -100 : 0;

	emit("edit-points", props.points.illegitimate + operand);
}

watch(totalPoints, (val) => {
	textInput.value = val;
});
</script>

<template>
	<li class="flex flex-col items-center gap-1">
		<span class="font-bold text-red-400">{{ name }}</span>

		<div
			class="w-24 rounded bg-stone-50 p-1 shadow shadow-black/30 transition-colors"
		>
			<input
				ref="textBox"
				v-model="textInput"
				type="number"
				class="w-full bg-transparent px-2 text-center outline-none"
				@keydown.enter="textBox?.blur()"
				@blur="textBoxEditPoints"
			/>

			<div class="mt-1 flex gap-1">
				<button type="button" @click="btnEditPoints('subtract')">
					<IconMinus />
				</button>

				<button type="button" @click="btnEditPoints('add')">
					<IconPlus />
				</button>
			</div>
		</div>
	</li>
</template>

<style scoped lang="postcss">
button {
	@apply flex grow justify-center rounded-sm bg-red-400 text-white shadow-sm shadow-black/30 transition-transform hover:-translate-y-1;
}
</style>
