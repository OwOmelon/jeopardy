<script setup lang="ts">
import { ref, watch } from "vue";
import type { Guest } from "@/stores/guests";

const props = defineProps<Guest>();

const emit = defineEmits<{
	"edit-points": [Guest["id"], number];
}>();

const textBox = ref<HTMLInputElement | null>(null);
const textInput = ref<number>(props.points);

function onBlur(): void {
	if (!textInput.value.toString().length) {
		textInput.value = props.points;
		return;
	}

	emit("edit-points", props.id, textInput.value);
}

watch(
	() => props.points,
	(val) => {
		textInput.value = val;
	},
);
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
