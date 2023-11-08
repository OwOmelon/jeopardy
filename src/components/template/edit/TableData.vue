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
		<p
			:class="[{ 'opacity-50': !question }, 'line-clamp-3 group-hover:hidden']"
		>
			{{ question || "Add Question" }}
		</p>

		<p
			:class="[
				{ 'opacity-50': !answer },
				'line-clamp-3 hidden group-hover:block',
			]"
		>
			{{ answer || "Add Answer" }}
		</p>
	</td>
</template>
