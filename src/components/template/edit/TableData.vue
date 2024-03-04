<script setup lang="ts">
import type { TableDataCell } from "@/stores/template";

const props = defineProps<
	{
		dataValues: string;
	} & TableDataCell
>();

const emit = defineEmits<{
	edit: [];
}>();
</script>

<template>
	<td
		:class="[
			row,
			column,
			'td-stylized td-rise cell cell-width cell-padding group relative !border-x-0 bg-stone-700 text-stone-300',
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

		<hr
			:class="[
				dataValues === 'complete'
					? '!border-b-green-400'
					: dataValues === 'partial'
						? '!border-b-yellow-400'
						: dataValues === 'empty'
							? '!border-b-red-400'
							: '',
				'data-values-status-bar pointer-events-none absolute -bottom-[2px] left-0 h-3 w-full rounded-[inherit] border-0 border-b-2 border-transparent opacity-0 transition-opacity group-hover:opacity-100',
			]"
		/>
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
