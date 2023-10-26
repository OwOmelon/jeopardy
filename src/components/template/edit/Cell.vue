<script setup lang="ts">
import { computed } from "vue";
import { useTemplateStore } from "@/stores/template";

import type { RowID, Column, CompleteTableCell } from "@/stores/template";

const template = useTemplateStore();

const props = defineProps<{
	cell: CompleteTableCell;
	hovered: boolean;
}>();

const emit = defineEmits<{
	"on-mouse-enter": [RowID, Column["id"]];
	"on-mouse-leave": [];
}>();

const dynamicStyles = computed<string>(() => {
	const isMissingData = template.cellHasMissingData(
		props.cell.row,
		props.cell.column,
	);

	const playStyles = !template.editing
		? `playing ${props.cell.answeredBy !== undefined ? "answered" : ""} ${
				isMissingData ? "pointer-events-none" : ""
		  }`
		: "";

	const rise = !(!template.editing && props.cell.answeredBy !== undefined)
		? "hover-rise"
		: "";

	return `${playStyles} ${isMissingData ? "missing-data" : ""} ${rise}`;
});

const textDisplay = computed<number | string>(() => {
	if (!template.editing)
		return template.cellHasMissingData(props.cell.row, props.cell.column)
			? ""
			: props.cell.points;

	const question = props.cell.question || "Add Question";
	const answer = props.cell.answer || "Add Answer";

	return props.hovered ? answer : question;
});
</script>

<template>
	<td
		:class="[
			dynamicStyles,
			'cell cell-width cell-padding bg-stone-300 text-stone-500',
		]"
		@mouseenter="emit('on-mouse-enter', props.cell.row, props.cell.column)"
		@mouseleave="emit('on-mouse-leave')"
		@click="
			() => {
				template.activeCell = JSON.parse(JSON.stringify(props.cell));
			}
		"
	>
		<p class="line-clamp-3">
			{{ textDisplay }}
		</p>
	</td>
</template>

<style scoped lang="postcss">
.hover-rise {
	@apply hover:-translate-y-2 hover:scale-105 hover:shadow-lg;
}

.missing-data {
	@apply !bg-stone-500 !text-stone-100;
}

.playing {
	@apply grid place-items-center hover:bg-red-400 hover:text-white;
}

.playing p {
	@apply text-lg font-bold;
}

.answered {
	@apply opacity-0 hover:opacity-50;
}
</style>
