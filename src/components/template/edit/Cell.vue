<script setup lang="ts">
import { computed } from "vue";
import { useTemplateStore } from "@/stores/template";

import type { RowID, Column, CompleteTableCell } from "@/stores/template";

const template = useTemplateStore();

const props = defineProps<
	{
		hovered: boolean;
	} & CompleteTableCell
>();

const emit = defineEmits<{
	"on-mouse-enter": [RowID, Column["id"]];
	"on-mouse-leave": [];
	edit: [];
}>();

const dynamicStyles = computed<string>(() => {
	const isMissingData = template.cellHasMissingData(props.row, props.column);

	const playStyles = !template.editing
		? `playing ${props.answeredBy !== undefined ? "answered" : ""} ${
				isMissingData ? "pointer-events-none" : ""
		  }`
		: "";

	const rise = !(!template.editing && props.answeredBy !== undefined)
		? "hover-rise"
		: "";

	return `${playStyles} ${isMissingData ? "missing-data" : ""} ${rise}`;
});

const textDisplay = computed<number | string>(() => {
	if (!template.editing)
		return template.cellHasMissingData(props.row, props.column)
			? ""
			: props.points;

	const question = props.question || "Add Question";
	const answer = props.answer || "Add Answer";

	return props.hovered ? answer : question;
});
</script>

<template>
	<td
		:class="[dynamicStyles, 'cell cell-width cell-padding td-rise']"
		@mouseenter="emit('on-mouse-enter', props.row, props.column)"
		@mouseleave="emit('on-mouse-leave')"
		@click="emit('edit')"
	>
		<p class="line-clamp-3">
			{{ textDisplay }}
		</p>
	</td>
</template>

<style scoped lang="postcss">
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
