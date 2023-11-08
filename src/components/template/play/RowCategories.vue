<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";

const template = useTemplateStore();
</script>

<template>
	<tr class="items-end">
		<th
			v-for="column in template.filteredColumns"
			class="cell cell-width cell-padding bg-red-400 text-white"
		>
			{{ column.category || column.id }}
		</th>
	</tr>
</template>
