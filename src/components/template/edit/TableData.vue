<script setup lang="ts">
import { computed } from "vue";

import type { RowID, Column, CompleteTableCell } from "@/stores/template";

const props = defineProps<
	{
		dataValues: string;
		hovered: boolean;
	} & CompleteTableCell
>();

const emit = defineEmits<{
	"on-mouse-enter": [RowID, Column["id"]];
	"on-mouse-leave": [];
	edit: [];
}>();

const textDisplay = computed<number | string>(() => {
	const question = props.question || "Add Question";
	const answer = props.answer || "Add Answer";

	return props.hovered ? answer : question;
});
</script>

<template>
	<td
		:class="[
			{
				'!bg-stone-500 !text-stone-100': props.incomplete,
			},
			'cell cell-width cell-padding td-rise',
		]"
		@mouseenter="emit('on-mouse-enter', props.row, props.column)"
		@mouseleave="emit('on-mouse-leave')"
		@click="emit('edit')"
	>
		<p class="line-clamp-3">
			{{ textDisplay }}
		</p>
	</td>
</template>
