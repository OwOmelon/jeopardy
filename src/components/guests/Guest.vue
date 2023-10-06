<script setup lang="ts">
import { ref } from "vue";
import type { Guest } from "@/stores/guests";

const props = defineProps<Guest>();

const emit = defineEmits<{
	"edit-guest-name": [];
	"delete-guest": [Guest["id"]];
	'update-points': [number]
}>();

const textBox = ref<HTMLInputElement | null>(null);
const textInput = ref<number>(props.points);

function onKeydownEnter(): void {
	if (!textInput.value.toString().length) {
		textInput.value = props.points;
		return;
	}

	emit("update-points", textInput.value);
}
</script>

<template>
	<li class="group relative flex flex-col items-center">
		<span contenteditable class="font-bold text-red-400">{{ name }}</span>
		<input
				ref="textBox"
				v-model="textInput"
				type="number"
				class="w-14 bg-transparent"
				@keydown.enter="textBox?.blur()"
				@blur="onKeydownEnter"
			/>
	</li>
</template>
