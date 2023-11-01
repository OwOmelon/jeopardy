<script setup lang="ts">
import { ref, watch } from "vue";
import { useTemplateStore } from "@/stores/template";
import DragHandle from "@/components/DragHandle.vue";

const props = defineProps<{
	rowIndex: number;
	points: number;
}>();

const emit = defineEmits<{
	"update-points": [number, number];
}>();

const template = useTemplateStore();

const textBox = ref<HTMLInputElement | null>(null);
const textInput = ref<number>(props.points);

function onBlur(): void {
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
	<th :class="['th-bg group relative grid w-full place-items-center rounded']">
		<input
			ref="textBox"
			v-model="textInput"
			type="number"
			class="cell cell-padding w-full bg-transparent text-center outline-none focus:!border-stone-100"
			@blur="onBlur"
			@keydown.enter="textBox?.blur()"
		/>

		<DragHandle v-if="template.editing" rotate />
	</th>
</template>
