<script setup lang="ts">
import type { TableDataCell } from "@/stores/template";

defineProps<{ isEmpty: boolean } & TableDataCell>();

const emit = defineEmits<{
	reveal: [];
}>();
</script>

<template>
	<td
		:class="[
			isEmpty ? 'pointer-events-none bg-stone-400/50 !shadow-none' : 'bg-stone-50',
			!answeredBy ? 'td-rise' : 'opacity-0 hover:opacity-50',
			'td-stylized cell cell-width cell-padding grid place-items-center text-stone-600 hover:bg-red-400 hover:text-white',
		]"
		@click="emit('reveal')"
	>
		<template v-if="!isEmpty">
			<span class="text-lg font-bold">{{ points }}</span>
			<span v-if="answeredBy">{{ answeredBy }}</span>
		</template>
	</td>
</template>
