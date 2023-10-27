<script setup lang="ts">
import type { CompleteTableCell } from "@/stores/template";

defineProps<{ isEmpty: boolean } & CompleteTableCell>();

const emit = defineEmits<{
	reveal: [];
}>();
</script>

<template>
	<td
		:class="[
			{ '!bg-stone-500': isEmpty },
			{ 'td-rise': answeredBy === undefined },
			'cell cell-width cell-padding td-rise grid place-items-center hover:bg-red-400 hover:text-white',
		]"
		@click="emit('reveal')"
	>
		<span v-if="!isEmpty" class="text-lg font-bold">{{ points }}</span>
	</td>
</template>
