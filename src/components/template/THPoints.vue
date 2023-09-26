<script setup lang="ts">
import { ref, watch } from "vue";
import DragHandle from "@/components/DragHandle.vue";

const props = defineProps<{
	rowIndex: number;
	points: number;
}>();

const emit = defineEmits<{
	"update-points": [number, number];
}>();

const textBox = ref<HTMLInputElement | null>(null);
const textInput = ref<number>(props.points);

function onKeydownEnter(): void {
	if (!textInput.value.toString().length) {
		textInput.value = props.points;
		return;
	}

	emit("update-points", textInput.value, props.rowIndex);
}

watch(
	() => props.points,
	(value) => {
		textInput.value = value;
	},
);
</script>

<template>
	<th class="group grid place-items-center">
		<div>
			<input
				ref="textBox"
				v-model="textInput"
				type="number"
				class="w-20 bg-transparent p-2 text-center outline-none"
				@keydown.enter="textBox?.blur()"
				@blur="onKeydownEnter"
			/>

			<DragHandle rotate />
		</div>
	</th>
</template>
