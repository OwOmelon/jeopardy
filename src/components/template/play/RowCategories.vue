<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";
import type { Column } from "@/stores/template";

const template = useTemplateStore();

const props = defineProps<{
	columns: Column[]
}>()
</script>

<template>
	<tr>
		<th
			v-for="column in props.columns"
			class="cell cell-width cell-padding bg-red-400 text-white"
		>
			{{ column.category || column.id }}
		</th>
	</tr>
</template>
