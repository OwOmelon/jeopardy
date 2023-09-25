<script setup lang="ts">
import { computed } from "vue";
import { useTemplateStore } from "@/stores/template";

import type { Row, Category, TableDisplayCell } from "../../stores/template";

const template = useTemplateStore();

const props = defineProps<{
	rowID: Row;
	columnID: Category["id"];
	data: TableDisplayCell;
	hovered: boolean;
}>();

const emit = defineEmits<{
	"on-mouse-enter": [Row, Category["id"]];
	"on-mouse-leave": [];
}>();

const missingData = computed<boolean>(() => {
	return !props.data.question || !props.data.answer;
});

const textDisplay = computed<string>(() => {
	const question = props.data.question || "Add Question";
	const answer = props.data.answer || "Add Answer";

	return props.hovered ? answer : question;
});
</script>

<template>
	<td
		:class="[
			missingData
				? 'bg-stone-500 text-stone-50'
				: 'bg-stone-400 text-stone-800',
			'h-20 cursor-pointer rounded p-2 text-xs shadow !shadow-black/30 transition-[box-shadow,_transform] hover:-translate-y-2 hover:scale-105 hover:shadow-lg active:scale-100',
		]"
		@mouseenter="emit('on-mouse-enter', props.rowID, props.columnID)"
		@mouseleave="emit('on-mouse-leave')"
		@click="
			() => {
				template.activeCellIndeces.row = props.rowID;
				template.activeCellIndeces.column = props.columnID;
			}
		"
	>
		<p>{{ textDisplay }}</p>
	</td>
</template>
