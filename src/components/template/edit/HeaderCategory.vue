<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useTemplateStore } from "@/stores/template";

import DragHandle from "@/components/DragHandle.vue";
import TextBox from "@/components/TextBox.vue";

import type { Column } from "@/stores/template";

const props = defineProps<{
	column: Column;
}>();

const emit = defineEmits<{
	"change-column-category": [string, Column["id"]];
}>();

const template = useTemplateStore();

const textInput = ref(props.column.category);

const hrColor = computed<string>(() => {
	let emptyCells = 0;

	template.rows.forEach((row) => {
		const cell = template.rawTable[row][props.column.id];

		if (!cell.question || !cell.answer) {
			emptyCells++;
		}
	});

	return emptyCells === 0
		? "border-green-400"
		: emptyCells === 5
		? "border-red-400"
		: "border-yellow-400";
});

watch(
	() => props.column,
	(val) => {
		textInput.value = val.category;
	},
);
</script>

<template>
	<th class="cell-width group relative">
		<TextBox
			v-model="textInput"
			:placeholder="props.column.id"
			:disabled="!template.editing"
			focus-classes="!border-b-red-400"
			blur-on-keydown-enter
			:class="[
				{ '!bg-red-400 !text-white': !template.editing },
				'cell cell-padding',
			]"
			@blur="emit('change-column-category', textInput, props.column.id)"
		/>

		<hr :class="[hrColor, 'my-3 rounded-full border-t-2']" />

		<DragHandle v-if="template.editing" />
	</th>
</template>
