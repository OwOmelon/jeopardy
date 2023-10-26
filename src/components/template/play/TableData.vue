<script setup lang="ts">
import type { CompleteTableCell } from "@/stores/template";

defineProps<CompleteTableCell>();

const emit = defineEmits<{
	reveal: [];
}>();
</script>

<template>
	<td
		class="cell cell-width cell-padding td-rise grid place-items-center hover:bg-red-400 hover:text-white"
		@click="emit('reveal')"
	>
		<span class="text-lg font-bold">{{ points }}</span>
	</td>
</template>
