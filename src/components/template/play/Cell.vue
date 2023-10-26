<script setup lang="ts">
import type { CompleteTableCell } from "@/stores/template";

const props = defineProps<{
	cell: CompleteTableCell;
}>();

const emit = defineEmits<{
	reveal: [];
}>();
</script>

<template>
	<td class="cell cell-width cell-padding td-rise" @click="emit('reveal')">
		<span class="text-lg font-bold">{{ cell.points }}</span>
	</td>
</template>
