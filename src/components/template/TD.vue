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

const textDisplay = computed<number | string>(() => {
	if (!template.editing) return props.data.points;

	const question = props.data.question || "Add Question";
	const answer = props.data.answer || "Add Answer";

	return props.hovered ? answer : question;
});
</script>

<template>
	<td
		:class="[
			{
				'td-missing-data': template.cellHasMissingData(
					props.rowID,
					props.columnID,
				),
			},
			{ 'grid place-items-center !text-lg': !template.editing },
			'text-xs',
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
