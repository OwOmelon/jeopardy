<script setup lang="ts">
import { computed } from "vue";
import { useTemplateStore } from "@/stores/template";

import type { RowID, Category, TableDisplayCell } from "@/stores/template";

const template = useTemplateStore();

const props = defineProps<{
	rowID: RowID;
	columnID: Category["id"];
	cell: TableDisplayCell;
	hovered: boolean;
}>();

const emit = defineEmits<{
	"on-mouse-enter": [RowID, Category["id"]];
	"on-mouse-leave": [];
}>();

const missingDataStyles = computed<string>(() => {
	return template.cellHasMissingData(props.rowID, props.columnID)
		? `missing-cell ${template.editing ? "" : "pointer-events-none"}`
		: "";
});

const textDisplay = computed<number | string>(() => {
	if (!template.editing)
		return template.cellHasMissingData(props.rowID, props.columnID)
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
			{ 'hover-rise': !(!template.editing && props.cell.answeredBy) },
			!template.editing
				? `playing ${props.cell.answeredBy !== undefined ? 'answered' : ''}`
				: '',
			missingDataStyles,
			'cell-padding h-[9.5ex] cursor-pointer rounded bg-stone-300 text-xs text-stone-500 shadow !shadow-black/30 transition-[background-color,_color,_box-shadow,_opacity,_transform] active:scale-100',
		]"
		@mouseenter="emit('on-mouse-enter', props.rowID, props.columnID)"
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

.missing-cell {
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
