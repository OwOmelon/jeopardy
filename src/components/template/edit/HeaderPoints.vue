<script setup lang="ts">
import { ref, watch } from "vue";
import DragHandle from "./draggable/DragHandle.vue";

import type { RowID } from "@/stores/template";

const props = defineProps<{
	row: RowID;
	points: number;
}>();

const emit = defineEmits<{
	"update-points": [RowID, typeof props.points];
}>();

const textBox = ref<HTMLInputElement | null>(null);
const textInput = ref<number>(props.points);

function onBlur(): void {
	if (!textInput.value.toString().length) {
		textInput.value = props.points;
		return;
	}

	emit("update-points", props.row, textInput.value);
}

watch(
	() => props.points,
	(value) => {
		textInput.value = value;
	},
);
</script>

<template>
	<th>
		<div class="bounce-x-wrapper">
			<div
				class="cell th-bg group relative grid w-full place-items-center rounded"
			>
				<input
					ref="textBox"
					v-model="textInput"
					type="number"
					class="cell-padding w-full bg-transparent text-center outline-none"
					@blur="onBlur"
					@keydown.enter="textBox?.blur()"
				/>

				<DragHandle rotate />
			</div>
		</div>
	</th>
</template>
