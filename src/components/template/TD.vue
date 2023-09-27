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

const missingDataStyles = computed<string>(() => {
	return template.cellHasMissingData(props.rowID, props.columnID)
		? `td-missing-data ${template.editing ? "" : "pointer-events-none"}`
		: "";
});

const textDisplay = computed<number | string>(() => {
	if (!template.editing)
		return template.cellHasMissingData(props.rowID, props.columnID)
			? ""
			: props.data.points;

	const question = props.data.question || "Add Question";
	const answer = props.data.answer || "Add Answer";

	return props.hovered ? answer : question;
});
</script>

<template>
	<td
		:class="[{ 'td-playing': !template.editing }, missingDataStyles, 'text-xs']"
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

<style scoped lang="postcss">
td {
	@apply h-16 cursor-pointer rounded bg-stone-300 p-2 text-stone-600 shadow !shadow-black/30 transition-[background-color,_color,_box-shadow,_transform] hover:-translate-y-2 hover:scale-105 hover:shadow-lg active:scale-100;
}

.td-missing-data {
	@apply !bg-stone-500 !text-stone-100;
}

.td-playing {
	@apply grid place-items-center !text-lg hover:bg-red-400 hover:text-white;
}
</style>
