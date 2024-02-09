<script setup lang="ts">
import { ref, watch } from "vue";
import DragHandle from "@/components/DragHandle.vue";

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

<style scoped lang="postcss">
.bounce-x .bounce-x-wrapper {
	animation: bounce-x 2s ease-in-out infinite;
}

.dragging .cell {
	@apply opacity-50;
}

.drop-to .cell {
	@apply -translate-x-1;
}

@keyframes bounce-x {
	0%,
	100% {
		transform: translateX(0);
	}

	50% {
		transform: translateX(-0.5rem);
	}
}
</style>
