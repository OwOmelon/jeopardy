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
		<div :class="[{ 'text-stone-500': !question.text }, 'group-hover:hidden']">
			<img
				v-if="!question.text && question.image"
				:src="question.image"
				:alt="`image for question ${column} of ${row}`"
			/>

			<p v-else>
				{{ question.text || "Add Question" }}
			</p>
		</div>

		<div
			:class="[
				{ 'text-stone-500': !answer.text },
				'!hidden group-hover:!block',
			]"
		>
			<img
				v-if="!answer.text && answer.image"
				:src="answer.image"
				:alt="`image for answer ${column} of ${row}`"
			/>

			<p v-else>
				{{ answer.text || "Add Answer" }}
			</p>
		</div>
	</td>
</template>

<style scoped lang="postcss">
div {
	@apply h-full w-full;
}

p {
	@apply line-clamp-3 break-words;
}

img {
	@apply mx-auto h-full;
}
</style>
