<script setup lang="ts">
import type { CompleteTableCell } from "@/stores/template";

const props = defineProps<
	{
		dataValues: string;
	} & CompleteTableCell
>();

const emit = defineEmits<{
	edit: [];
}>();
</script>

<template>
	<td
		:class="[
			dataValues === 'complete'
				? 'hover:!border-b-green-400'
				: dataValues === 'partial'
				? 'hover:!border-b-yellow-400'
				: dataValues === 'empty'
				? 'hover:!border-b-red-400'
				: '',
			'cell cell-width cell-padding td-rise group !border-x-0 bg-stone-700 text-stone-300',
		]"
		@click="emit('edit')"
	>
		<div :class="[{ 'opacity-50': !question.text }, 'group-hover:hidden']">
			<p>
				{{ question.text || "Add Question" }}
			</p>
		</div>

		<div :class="[{ 'opacity-50': !answer.text }, '!hidden group-hover:!block']">
			<p>
				{{ answer.text || "Add Answer" }}
			</p>
		</div>
	</td>
</template>

<style scoped lang="postcss">
p {
	@apply line-clamp-3 break-words;
}
</style>
