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
			isEmpty ? 'pointer-events-none bg-stone-500' : 'bg-stone-300',
			answeredBy === undefined ? 'td-rise' : 'opacity-0 hover:opacity-50',
			'cell cell-width cell-padding grid place-items-center hover:bg-red-400 hover:text-white',
		]"
		@click="emit('reveal')"
	>
		<template v-if="!isEmpty">
			<span class="text-lg font-bold">{{ points }}</span>
			<span v-if="answeredBy">{{ answeredBy }}</span>
		</template>
	</td>
</template>
