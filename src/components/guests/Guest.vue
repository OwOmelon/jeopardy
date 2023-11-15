<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Guest } from "@/stores/guests";

const props = defineProps<Guest>();

const emit = defineEmits<{
	"edit-points": [number];
}>();

const totalPoints = computed<number>(() => {
	return props.points.legitimate + props.points.illegitimate;
});

const textBox = ref<HTMLInputElement | null>(null);
const textInput = ref<number>(totalPoints.value);

function onBlur(): void {
	if (!textInput.value.toString().length) {
		textInput.value = totalPoints.value;
		return;
	}

	emit("edit-points", textInput.value - props.points.legitimate);
}

watch(totalPoints, (val) => {
	textInput.value = val;
});
</script>

<template>
	<li class="group relative flex flex-col items-center">
		<span class="font-bold text-red-400">{{ name }}</span>

		<input
			ref="textBox"
			v-model="textInput"
			type="number"
			class="w-20 rounded border-2 border-transparent bg-red-400 bg-transparent px-2 text-center outline-none transition-colors hover:border-red-400 focus:bg-red-400 focus:text-white"
			@keydown.enter="textBox?.blur()"
			@blur="onBlur"
		/>
	</li>
</template>
