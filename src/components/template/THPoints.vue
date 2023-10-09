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

const focused = ref<boolean>(false)

function onBlur(): void {
	if (!textInput.value.toString().length) {
		textInput.value = props.points;
		return;
	}

	focused.value = false
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
	<th :class="[{'!border-b-red-400': focused}, 'group relative grid place-items-center']">
		<input
			ref="textBox"
			v-model="textInput"
			type="number"
			class="textBox w-20 bg-transparent text-center outline-none"
			@focus="focused = true"
			@blur="onBlur"
			@keydown.enter="textBox?.blur()"
		/>

		<DragHandle v-if="template.editing" rotate />
	</th>
</template>
